# Stage 1: Build the React/Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Sao chép package.json và package-lock.json để tận dụng cache Docker
COPY package.json package-lock.json ./
RUN npm install

# Sao chép toàn bộ mã nguồn
COPY . .

# Build ứng dụng. 
# VITE_API_URL được set trong file .env.local và được đọc bởi Vite
RUN npm run build


# Stage 2: Serve the built application using a lightweight web server (Nginx)
FROM nginx:alpine AS final

# Xóa cấu hình Nginx mặc định
RUN rm /etc/nginx/conf.d/default.conf

# Tạo một file cấu hình Nginx đơn giản để serve file tĩnh
# try_files $uri $uri/ /index.html; là cần thiết cho các ứng dụng SPA (Single Page Application)
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

# Sao chép các file đã build từ stage 'builder'
COPY --from=builder /app/dist /usr/share/nginx/html

# Chạy Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]