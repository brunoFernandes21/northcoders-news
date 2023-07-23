# Northcoders News API

This API allows the application data to be accessed programmatically. 
Users are able to fetch data from various endpoints available in the API.
To see a list and description of all the the endpoints available, check the endpoints.json file.

## Hosted version

https://brunofernandes-northcoders-news.onrender.com/api

## How to use the API

1 - Start by cloning the repo
git clone <project-url>
cd into project folder
2 - To install all the dependencies run the following command
[npm install]
3 - To seed local database, run the following command
[npm run seed]
4 - To run tests, run the following command
[npm run test]

## Connecting to the database locally

In order to successfully connect to the database locally, you will need to create 2 .env files. Into each, add PGDATABASE=<databaseName>
From your root folder:
    1 - Create a new file called <.env.test>. This is where you will put the database name in order to connect to it. This will allow you to connect to the test database which is used to run all the necessary tests.
    2 - Create a new file called <.env.development>. This is where you will put the database name in order to connect to it. This will allow you to connect to the database which contains the real data. 

## Minimum version of Node and Postgres needed to run the project

Node 19.8.1
Postgres 15.3

