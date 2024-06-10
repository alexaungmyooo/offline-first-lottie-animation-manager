# Use the official Node.js image as the base image
FROM node:22-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application (assuming you're using TypeScript)
RUN npm run build

# Ensure the uploads directory exists
RUN mkdir -p /app/uploads

# Copy the Prisma schema and generate the client
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Use a separate stage for the runtime image to keep it smaller
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app ./

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the application
# CMD ["node", "dist/server.js"]
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.1/wait /wait
RUN chmod +x /wait

# CMD /wait && yarn start:migrate:prod
# Define the command to run the application
CMD /wait db:3306 && yarn start:migrate:prod

