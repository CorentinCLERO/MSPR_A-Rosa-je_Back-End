# Nodejs Express Mysql Sequelize Demo App

This is a demo node.js application illustrating various features used in everyday web development, with a fine touch of best practices.

Database - MySQL (Setup local or test instance for development use, setup in AWS RDS for prod)
Framework - nodejs (express, pm2) - Run with pm2 to manage uptime/restarts/long term deploys

## Getting Setup
Setup nodejs and mysql.

## Requirements
* [NodeJs](https://nodejs.org) >= 20.x 

## Install

```sh
$ git clone https://github.com/CorentinCLERO/MSPR_A-Rosa-je_Back-End.git
$ npm install
$ sudo npm install -g pm2
$ sudo pm2 start pm2.json
```
## Run
```sh
$ npm start
```
## Run server with pm2
```sh
$ sudo pm2 start pm2.json
```
## Test api with postman
Please import `Node-Express-MySQL-DEMO.postman_collection.json ` into your post man
There are 6 apis you can test 

## DB migration with sequelize
```sh
$ npx sequelize-cli db:migrate
```
**NOTE:** You can find migration template files from ./migrations
