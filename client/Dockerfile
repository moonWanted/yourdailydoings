FROM node

WORKDIR /client
COPY package.json .

# install app dependencies
COPY package.json ./client/package.json
COPY package-lock.json ./client/package-lock.json
RUN npm install

# add app
COPY . ./
ENV NODE_ENV development
EXPOSE 3000

# start app
CMD ["npm", "start"] 