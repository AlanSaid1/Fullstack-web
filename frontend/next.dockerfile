# Usa una imagen base oficial de Node.js
FROM node:18-alpine

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package.json package-lock.json ./

# Instala las dependencias del proyecto
RUN npm ci --legacy-peer-deps

# Copia el resto de los archivos del proyecto al directorio de trabajo
COPY . .

# Compila la aplicación (si es necesario)
RUN npm run build

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3000

# Define el comando para ejecutar la aplicación
CMD ["npm", "start"]
