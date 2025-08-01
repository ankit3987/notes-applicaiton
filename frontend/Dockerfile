# Use the official Node.js image
FROM node:18-alpine

# Set work directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code
COPY . .

# Expose the frontend port (3000 for create-react-app)
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
