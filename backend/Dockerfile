# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy app code
COPY . .

# Expose the backend port
EXPOSE 5000

# Run the server
#CMD ["npm", "run", "start"]
CMD ["node", "server.js"]
