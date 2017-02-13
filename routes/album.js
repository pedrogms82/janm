'use strict' //Rutas de artistas
//Cargamos express y controladores
var express = require('express');
var AlbumController = require('../controllers/album');
// Cargamos el router de express
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir: './uploads/album'});
//Creamos las Rutas
api.get('/album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/album', md_auth.ensureAuth, AlbumController.saveAlbum);
api.post('/albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums);
api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum);

// api.get('/album/:page?', md_auth.ensureAuth, AlbumController.getAlbum);
// api.delete('/album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum);
// api.post('/upload-image-album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage);
// api.get('/get-image-album/:imageFile', [md_auth.ensureAuth, md_upload], AlbumController.getImageFile);
//exportamos modulos
module.exports = api;
