# This Dockerfile creates a production-ready container for our Node.js backend.

# Stage 1: Build Stage
# This stage installs dependencies and compiles the TypeScript code into JavaScript.
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile the TypeScript code into the /dist folder
RUN npm run build

# Stage 2: Production Stage
# This stage creates a smaller, more secure final image for production.
FROM node:20-alpine

WORKDIR /app

# Copy only the compiled JavaScript code from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the package.json file
COPY package.json .

# Expose the port the app runs on
EXPOSE 5001

# The command to run the application
CMD [ "node", "dist/index.js" ]
