'use strict' //Rutas de artistas
//Cargamos express y controladores
var express = require('express');
var ArtistController = require('../controllers/artist');
// Cargamos el router de express
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
//Creamos las Rutas
api.get('/artist', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
//exportamos modulos
module.exports = api;
