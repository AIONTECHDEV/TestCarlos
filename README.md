# Bank Transfer Test
# Install dependencies
```
cd functions
npm install -g firebase-tools
npm install
```
# Compile project
This project is built with Typescript, you need to compile the code before you can test it or deploy it (the serverless file to deploy to AWS services points to lib folder), this command will create a lib folder with all the JS needed to run correctly
```
npm run build
```
# Run the project
```
npm run serve
```

# Documentation
https://petstore.swagger.io/?url=https://raw.githubusercontent.com/kuamatzin/testFrontend/master/test.yaml

# Project description

The development is based on serverless microservices hosted on Google Cloud Platform with Cloud Functions. The programming language used is NodeJS with the ExpressJS development framework. For the database I am using Firestore, a database service of Google Cloud NOSQL, however, it has transactional functions, which of course by the nature of this API it is necessary to implement to ensure that transactions between accounts are guaranteed.

The backend is developed under the MVC architecture, and the request is also validated to ensure that the data sent by the client meets the requirements to proceed with the request

I allowed myself to make a couple of changes in the API requirements. First, the API uses an authentication system and all routes need this authentication to proceed.

The first thing to do is create two accounts (to interact with transactions)

Log in with either account and authenticate with swagger

Once authenticated we can proceed to GET the information of our account to verify our balance and more importantly a GET / all to know all the available accounts and to be able to make a transaction.

Once we have an id to make a transaction we can use the POST to make a transaction