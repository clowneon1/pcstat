FROM node:latest

# Create app directory
RUN mkdir -p /app/src
WORKDIR /app/src

# Install app dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]
