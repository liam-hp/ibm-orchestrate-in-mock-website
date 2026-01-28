# Use nginx alpine for a lightweight web server
FROM nginx:alpine

# Copy all static files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY ibm.jpeg /usr/share/nginx/html/
COPY orchestrate_icon.png /usr/share/nginx/html/
COPY wxO-embed-chat-security-tool.sh /usr/share/nginx/html/
COPY ibm_manual/ /usr/share/nginx/html/ibm_manual/

# Expose port 8080 (Code Engine default)
EXPOSE 8080

# Create nginx config for port 8080
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Start nginx
CMD ["nginx", "-g", "daemon off;"]