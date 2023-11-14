# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
# RUN npm install -g npm
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port used by the development server
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start"]