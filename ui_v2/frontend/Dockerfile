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
#^was having an issue installing that dependency from package.json

# add app
COPY . ./

# start app
CMD ["npm", "start"]