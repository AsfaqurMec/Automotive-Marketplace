# Stage 1: Build Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run Next.js app
FROM node:18-alpine

WORKDIR /app

# Copy the built application from the previous stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --omit=dev

 
EXPOSE 3000

 
CMD ["npm", "run", "start"]
