# Use a slim Debian-based image that has Node.js pre-installed
FROM node:18-slim

# Install Python 3 and clean up package manager caches to keep it light
RUN apt-get update && apt-get install -y python3 && rm -rf /var/lib/apt/lists/*

# Set our application directory
WORKDIR /app

# Copy configuration handles and install node packages
COPY package*.json ./
RUN npm install

# Copy the rest of the backend engine code
COPY . .

# Open up port 8080 
EXPOSE 8080

# Kick off our server traffic controller
CMD ["node", "server.js"]
