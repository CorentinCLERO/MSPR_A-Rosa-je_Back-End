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
```

## Run

```sh
$ npm start
```

## DB migration with sequelize
```sh
$ npx sequelize-cli db:migrate
```

**NOTE:** You can find migration template files from ./migrations

[Sequelize Doc](https://sequelize.org/docs/v6/)

docker build -t imagebackendmspr .
docker tag imagebackendmspr europe-west9-docker.pkg.dev/idyllic-now-420018/mspr-backend/imagebackendmspr
docker push europe-west9-docker.pkg.dev/idyllic-now-420018/mspr-backend/imagebackendmspr

Database
msprarosaje
MSPRarosajeB3