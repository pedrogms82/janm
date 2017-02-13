'use strict' //Controlador de albumas
//Cargamos filesystem y path
var fs = require('fs');
var path = require('path');
var mongoosePagination = require("mongoose-pagination");
//cargamos modelos
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
//Metodos
//Ver Albums
function getAlbum(req, res) {
  var albumId = req.params.id;

  Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
    if(err) res.status(500).send({message: 'Error en petición album'});
    else{
      if(!album) res.status(404).send({message: 'No existe album'});
      else  res.status(200).send({album});
    }
  });
}
//Guardar Album
function saveAlbum(req, res){

  var album = new Album();
  var params = req.body;

  console.log(params);
  album.title = params.title;
  album.description = params.description;
  album.year = params.year;
  album.image = params.image;
  album.artist = params.artist;

  album.save((err, albumStored)=>{
    if(err) res.status(500).send({message: 'Error al Servidor - saveAlbum'});
    else{
      if (!albumStored) res.status(404).send({message: 'No se guardo el album'});
        else  res.status(200).send({album: albumStored});
    }
  });
}
//Listar albumes
function getAlbums(req, res){
//  var params = req.body;
  var artistId = req.params.artist;

  if(!artistId){
    var find = Album.find({}).sort('title');
  }
  else{
    var find = Album.find({artist: artistId}).sort('year');
  }

find.populate({path: 'artist'}).exec((err, albums) =>{
  if(err) res.status(500).send({message: 'Error al Servidor - getAlbums'});
  else{
    if (!albums) res.status(404).send({message: 'No se encuentran albums'});
      else  res.status(200).send({album: albums});
  }
});
}
//Actualizar album
function updateAlbum(req, res) {
  var albumId = req.params.id;
  var update = req.body;

//  console.log(update);console.log(req.body);console.log(req.params);

  Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) =>{
    if(err) res.status(500).send({message: 'Error al Servidor - updateAlbum'});
    else{
      if (!albumUpdated) res.status(404).send({message: 'No se actualizo el album'});
      else  res.status(200).send({album: albumUpdated, actualizo: update});
    }
  });

}
//Exportamos modulos
module.exports = {
  getAlbum,
  getAlbums,
  saveAlbum,
  updateAlbum
}
