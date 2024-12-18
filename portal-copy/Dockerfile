# Use an official Node runtime as a parent image
FROM node:14 as build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code to the container
COPY . .

# Build the Angular app for production
RUN npm run build --prod

# Use a smaller image for serving the Angular app
FROM nginx:alpine

# Copy the built app from the 'build' stage to the nginx public directory
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
