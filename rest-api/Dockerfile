# Use a slim version of Node.js 24 based on Debian Bookworm
FROM node:24-bookworm-slim

# Working directory instead of using absolute paths
WORKDIR /app  

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma client
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/urlshortener?schema=public" npx prisma generate

# Expose the port the app runs on
CMD ["npm", "start"]
