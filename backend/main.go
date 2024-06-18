package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var jwtKey = []byte("my_secret_key")

type contextKey string

const (
    contextKeyUsername contextKey = "username"
    contextKeyUserID   contextKey = "userId"
)

type Credentials struct {
    Username string `json:"username"`
    Password string `json:"password"`
}

type Claims struct {
    Username string `json:"username"`
    jwt.RegisteredClaims
}

type User struct {
    Id       int    `json:"id"`
    Username string `json:"username"`
    Password string `json:"password"`
    Email    string `json:"email"`
}

type Bond struct {
    Id       int     `json:"id"`
    Name     string  `json:"name"`
    Number   int     `json:"number"`
    Price    float64 `json:"price"`
    Currency string  `json:"currency"`
    SellerId int     `json:"seller_id"`
    BuyerId  *int    `json:"buyer_id"` // BuyerID can be null
}

// main function
func main() {
    // connect to database
    db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
    if err != nil {
        log.Fatal("Error opening database connection:", err)
    }
    defer db.Close()

    // create tables if not exists
    _, err = db.Exec(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        );
        
        CREATE TABLE IF NOT EXISTS bonds (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL CHECK (char_length(name) >= 3 AND char_length(name) <= 40),
            number INT NOT NULL CHECK (number >= 1 AND number <= 10000),
            price NUMERIC(15,4) NOT NULL CHECK (price >= 0 AND price <= 100000000),
            currency TEXT NOT NULL CHECK (char_length(currency) = 3),
            seller_id INT NOT NULL,
            buyer_id INT
        )
    `)
    if err != nil {
        log.Fatal("Error creating tables:", err)
    }

    // create router
    router := mux.NewRouter()

    // user endpoints
    router.HandleFunc("/api/go/users", createUser(db)).Methods("POST")
    router.HandleFunc("/api/go/login", loginUser(db)).Methods("POST")

    // bond endpoints
    router.HandleFunc("/api/go/bonds", createBond(db)).Methods("POST")
    router.HandleFunc("/api/go/bonds", getAvailableBonds(db)).Methods("GET")
    router.HandleFunc("/api/go/bonds/user", authMiddleware(db, getUserBonds(db))).Methods("GET")
    router.HandleFunc("/api/go/bonds/{id}/buy", authMiddleware(db, buyBond(db))).Methods("POST")
    router.HandleFunc("/api/go/exchange-rate", getExchangeRateHandler).Methods("GET")

    router.HandleFunc("/api/go/protected", authMiddleware(db, protectedEndpoint)).Methods("GET")

    enhancedRouter := enableCORS(jsonContentTypeMiddleware(router))

    log.Println("Server started on :8080")
    log.Fatal(http.ListenAndServe(":8080", enhancedRouter))
}

func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
}

func jsonContentTypeMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        next.ServeHTTP(w, r)
    })
}

func getExchangeRateHandler(w http.ResponseWriter, r *http.Request) {
    rate, err := getExchangeRate()
    if err != nil {
        http.Error(w, "Error fetching exchange rate: " + err.Error(), http.StatusInternalServerError)
        return
    }
    json.NewEncoder(w).Encode(map[string]float64{"exchange_rate": rate})
}

func getExchangeRate() (float64, error) {
    response, err := http.Get("https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno")
    if err != nil {
        return 0, err
    }
    defer response.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(response.Body).Decode(&result)

    rate, err := strconv.ParseFloat(result["bmx"].(map[string]interface{})["series"].([]interface{})[0].(map[string]interface{})["datos"].([]interface{})[0].(map[string]interface{})["dato"].(string), 64)
    if err != nil {
        return 0, err
    }

    return rate, nil
}

func loginUser(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var creds Credentials
		json.NewDecoder(r.Body).Decode(&creds)

		var storedCreds Credentials
		err := db.QueryRow("SELECT username, password FROM users WHERE username = $1", creds.Username).Scan(&storedCreds.Username, &storedCreds.Password)
		if err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password))
		if err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		expirationTime := time.Now().Add(10 * time.Minute)
		claims := &Claims{
			Username: creds.Username,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}

		token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		tokenString, err := token.SignedString(jwtKey)
		if err != nil {
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
	}
}

func authMiddleware(db *sql.DB, next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        tokenStr := r.Header.Get("Authorization")
        if tokenStr == "" {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        // Remove "Bearer " prefix
        tokenStr = tokenStr[len("Bearer "):]

        claims := &Claims{}
        token, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
            return jwtKey, nil
        })

        if err != nil || !token.Valid {
            http.Error(w, "Unauthorized", http.StatusUnauthorized)
            return
        }

        var userId int
        err = db.QueryRow("SELECT id FROM users WHERE username = $1", claims.Username).Scan(&userId)
        if err != nil {
            http.Error(w, "User not found", http.StatusUnauthorized)
            return
        }

        ctx := context.WithValue(r.Context(), contextKeyUserID, userId)
        next.ServeHTTP(w, r.WithContext(ctx))
    }
}

func protectedEndpoint(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("This is a protected endpoint"))
}

func createBond(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var bond Bond
        err := json.NewDecoder(r.Body).Decode(&bond)
        if err != nil {
            http.Error(w, "Invalid request payload", http.StatusBadRequest)
            return
        }

        err = db.QueryRow(
            "INSERT INTO bonds (name, number, price, currency, seller_id) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            bond.Name, bond.Number, bond.Price, bond.Currency, bond.SellerId,
        ).Scan(&bond.Id)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(bond)
    }
}

func getAvailableBonds(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        rows, err := db.Query("SELECT id, name, number, price, currency, seller_id, buyer_id FROM bonds WHERE buyer_id IS NULL")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var bonds []Bond
        for rows.Next() {
            var bond Bond
            if err := rows.Scan(&bond.Id, &bond.Name, &bond.Number, &bond.Price, &bond.Currency, &bond.SellerId, &bond.BuyerId); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            bonds = append(bonds, bond)
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(bonds)
    }
}

func getUserBonds(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        userId, ok := r.Context().Value(contextKeyUserID).(int)
        if !ok {
            http.Error(w, "User ID not found in context", http.StatusInternalServerError)
            return
        }

        rows, err := db.Query("SELECT id, name, number, price, currency, seller_id, buyer_id FROM bonds WHERE seller_id = $1 OR buyer_id = $1", userId)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var bonds []Bond
        for rows.Next() {
            var bond Bond
            if err := rows.Scan(&bond.Id, &bond.Name, &bond.Number, &bond.Price, &bond.Currency, &bond.SellerId, &bond.BuyerId); err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            bonds = append(bonds, bond)
        }

        w.Header().Set("Content-Type", "application/json")
        json.NewEncoder(w).Encode(bonds)
    }
}

func buyBond(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        vars := mux.Vars(r)
        bondId := vars["id"]

        // Assumes the user's ID is passed in the request context (e.g., via middleware)
        userId := r.Context().Value(contextKeyUserID).(int)

        // Check if the bond is already bought
        var buyerId sql.NullInt64
        err := db.QueryRow("SELECT buyer_id FROM bonds WHERE id = $1", bondId).Scan(&buyerId)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        if buyerId.Valid {
            http.Error(w, "Bond already bought", http.StatusBadRequest)
            return
        }

        // Update the bond to set the buyer_id
        _, err = db.Exec("UPDATE bonds SET buyer_id = $1 WHERE id = $2", userId, bondId)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusNoContent)
    }
}

func createUser(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var user User
        json.NewDecoder(r.Body).Decode(&user)

        hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        err = db.QueryRow("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id",
            user.Username, string(hashedPassword), user.Email).Scan(&user.Id)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        user.Password = ""
        json.NewEncoder(w).Encode(user)
    }
}
