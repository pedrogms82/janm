'use strict'

//
var express = require('express');
var bodyParser = require('body-parser');

//Creo app
var app = express();

//Rutas

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
//Cabeceras http


//rutas base

app.get('/pruebas', function (req, res){
   res.status(200).send({message: "Ok - Carga prueba correcta"});
});


module.exports = app;
