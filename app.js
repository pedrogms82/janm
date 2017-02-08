'use strict'

//
var express = require('express');
var bodyParser = require('body-parser');

//Creo app
var app = express();

//Rutas

var userRoutes = require('./routes/user');
var UserController = require('./controllers/user');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cabeceras http


//rutas base
app.get('/api', userRoutes);
app.post('/api', userRoutes);

app.post('/signup', UserController.saveUser);
app.post('/login', UserController.loginUser);

app.get('/signup', function (req, res){
   res.status(200).send({message: "Ok - Pagina de signup"});
});


app.get('/pruebas', function (req, res){
   res.status(200).send({message: "Ok - Carga prueba correcta"});
});
//
// app.get('/usertest', function (req, res){
//    res.status(200).send({message: "Ok - User test de APP"});
// });




module.exports = app;
