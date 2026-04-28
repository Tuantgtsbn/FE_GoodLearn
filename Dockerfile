FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build static files
RUN npm run build

EXPOSE 3000

# Chạy server preview của Vite và expose ra mạng ngoài của container
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
