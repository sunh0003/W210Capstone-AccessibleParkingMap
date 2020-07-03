# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install @iconify/react@1.1.3 
RUN npm install --save react-google-maps 
RUN npm install url-loader

# add app
COPY . ./

# start app
CMD ["npm", "start"]