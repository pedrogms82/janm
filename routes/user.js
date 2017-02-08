'use strict' //Rutas de usuarios

var express = require('express');
var UserController = require('../controllers/user');

// Cargamos el router de express
var api = express.Router();

//Creamos las Rutas

api.get('/user', UserController.pruebas);


api.post('/signup', UserController.saveUser);
api.post('/login', UserController.loginUser);



module.exports = api;
