# Simple URL Shortener
##### A url shortener built by node.js and mongoDB

Get Started
----
To start with:

1. Install Docker and Docker Compose
 * [Docker] (https://www.docker.com/get-docker)
 * [Docker-Compose] (https://docs.docker.com/compose/install/)
2. Change directory to project directory

   e.g. `$ cd  simple-url-shortener`
3. start up docker containers

   `$ docker-compose up`

4. You can also use the standalone node.js application
  1. Just change the mondoDB address at [node/routes/index.js:12](node/routes/index.js#L12) to your own mongoDB address

  `mongoose.connect('mongodb://mongo:27017/urlshort');`

  * and start the node.js application (with mongoDB already started) by

  `$ npm start`


This app use the following node modules:
----
* [hashids](https://github.com/ivanakimov/hashids.js)
* [mongoose](https://github.com/Automattic/mongoose)
* [expressjs](https://github.com/expressjs/express/)
