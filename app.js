'use strict'

var express = require('express');
var bodyParser = require('body-parser');

//Creo app
var app = express();

//Rutas

var userRoutes = require('./routes/user');
var artistRoutes = require('./routes/artist');
var UserController = require('./controllers/user');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cabeceras http

//rutas base
app.use('/api', [userRoutes, artistRoutes]);

//Asi seria sin el Router
// app.post('/signup', UserController.saveUser);
// app.post('/login', UserController.loginUser);
//Ejemplos
app.get('/signup', function (req, res){
   res.status(200).send({message: "Ok - Pagina de signup"});
});
app.get('/pruebas', function (req, res){
   res.status(200).send({message: "Ok - Carga prueba correcta"});
});

module.exports = app;
