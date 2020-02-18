# STEP 1 build static website
FROM node:alpine as builder

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install

# Copy project files into the docker image
COPY .  /app
RUN npm run build

# STEP 2 build a small nginx image with static website
FROM nginx:alpine

## Remove default nginx website
#RUN rm -rf /usr/share/nginx/html/*

## From 'builder' copy website to default nginx public folder
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]