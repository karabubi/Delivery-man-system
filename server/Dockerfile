FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm ci --omit=dev || npm ci

# Copy the rest of the server code
COPY . .

# Render sets PORT automatically (commonly 10000). Your app must listen on process.env.PORT.
# Expose is optional, but keep it aligned with your Express PORT (not Vite 5173).
EXPOSE 5001

# Run migrations, then start the backend server
# - migrate:latest is safe (only applies new migrations)
# - if knex is not installed globally, npx will run the local version
CMD ["sh", "-c", "npx knex migrate:latest && node server.js"]
