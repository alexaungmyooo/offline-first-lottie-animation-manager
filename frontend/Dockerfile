# Use the official Node.js image as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN npm run build

# Expose the port on which your application will run
EXPOSE 4173

# Set the environment variable for Vite
ENV VITE_API_URL=VITE_GRAPHQL_API_URL=http://localhost:4000/graphql

# Command to run the application with host binding
CMD ["npm", "run", "preview", "--", "--host"]
