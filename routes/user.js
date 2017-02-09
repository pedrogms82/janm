'use strict' //Rutas de usuarios
//Cargamos express y controladores
var express = require('express');
var UserController = require('../controllers/user');
// Cargamos el router de express
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/users'});
//Creamos las Rutas
api.get('/user', md_auth.ensureAuth, UserController.pruebas);
api.post('/signup', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-image-user/:imageFile', [md_auth.ensureAuth, md_upload], UserController.getImageFile);
//exportamos modulos
module.exports = api;
