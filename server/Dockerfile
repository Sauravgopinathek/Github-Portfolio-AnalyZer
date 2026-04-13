# Use the official lightweight Node.js 18 image
FROM node:18-slim

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend source code to the container
COPY . .

# Expose port (Hugging Face Spaces default is 7860)
EXPOSE 7860

# Start the server
CMD ["npm", "start"]
