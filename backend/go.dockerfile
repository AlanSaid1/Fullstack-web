# Backend Dockerfile
FROM golang:1.22.4-alpine

# Set the working directory inside the container
WORKDIR /app

COPY . .

#Download all the dependencies
RUN go get -d -v ./...

#Build the Go app
RUN go build -o api .

# Expose the port the app runs on
EXPOSE 8080

# Run the Go application
CMD ["./api"]
