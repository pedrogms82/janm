'use strict' //Controlador de artistas
//Cargamos filesystem y path
var fs = require('fs');
var path = require('path');
var mongoosePagination = require("mongoose-pagination");
//cargamos modelos
var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');
//Metodos
//ver artistas
function getArtist(req, res) {
  var artistId = req.params.id;
  Artist.findById(artistId, (err, artist) => {
    if(err) res.status(500).send({message: 'Error en petición artist'});
    else{
      if(!artist) res.status(404).send({message: 'No existe artist'});
      else  res.status(200).send({artist});
    }
  });
}
//Listado de artistas
function getArtists(req, res){
  if(req.params.page) var page = req.params.page;
  else var page = 1;
    var itemPerPage = 3;
    Artist.find().sort('name').paginate(page, itemPerPage, function (err, artists, total){
        if (err) res.status(500).send({message: 'Error en petición artistas'});
        else{
          if(!artists) res.status(404).send({message: 'No existen artists'});
          else  return res.status(200).send({Items: total, artists});
        }

    });
}
//Guardar artista
function saveArtist(req, res){
  var artist = new Artist();
  var params = req.body;

  artist.name = params.name
  artist.description = params.description
  artist.image = 'null'
  artist.save((err, artistStored) =>{
    if (err){
      res.status(500).send({message: "Error al guardar A"});
    }else{
      if(!artistStored){
        res.status(404).send({message: "No se ha Guardado A"});
      }else{
        res.status(200).send({artist: artistStored});
      }
    }
  });
}
//Actualizar artista
function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;


    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
      if (err) res.status(500).send({message: 'Error al actualizar artista'});
      else {
        if(!artistUpdated){
          res.status(404).send({message: "No se ha encontrado el artista"});
        }else{
          res.status(200).send({message: "Actualizado", artist: artistUpdated, datos: update});
        }
      }
    });
}
//Eliminar artista y sus historicos
function deleteArtist (req, res){
  var artistId = req.params.id;

  Artist.findByIdAndRemove(artistId, (err, artistRemoved)=>{
    if (err) res.status(500).send({message: 'Error al eliminar artista'});
    else {
      if(!artistRemoved) res.status(404).send({message: "No se ha eliminado el artista"});
      else {
        Album.find({artist: artistRemoved._id}).remove( (err, albumRemoved)=>{
          if (err) res.status(500).send({message: 'Error al eliminar album'});
          else {
            if(!albumRemoved)res.status(404).send({message: "No se ha eliminado el albun"});
            else {
              res.status(200).send({message: "Eliminado", album: albumRemoved});
              Song.find({album: albumRemoved._id}).remove( (err, songRemoved)=>{
                if (err) res.status(500).send({message: 'Error al eliminar songs'});
                else {
                  if(!songRemoved) res.status(404).send({message: "No se ha eliminado songs"});
                  else res.status(200).send({message: "Eliminado", songs: songRemoved});
                  }
              });
            }//else album
        }//else album
      });//callback album
      res.status(200).send({message: "Eliminado", artist: artistRemoved});
    }//else artist
  }//else artist
});//Artist find
}
//Imagen artista
function uploadImage(req, res){
  var artistId = req.params.id;
  var fileName = 'No hay fichero';

  if(req.files){
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];

    var extSplit = fileName.split('\.');
    var fileExt = extSplit[1];

    if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){
          Artist.findByIdAndUpdate(artistId, {image: fileName}, (err, artistUpdated) =>{
            if(err){
              res.status(500).send({message: 'Error al actualizar  la imagen de artista'});
            }else{
              if(!artistUpdated){
              res.status(404).send({message: 'La imagen de artista no se ha podido actualizar'});
              }else{
                res.status(200).send({'Artista antiguo': artistUpdated, 'Nueva imagen': fileName});
              }
            }
          });
    }else{
        res.status(200).send({message: 'Extension de archivo no valida'});
    }
    console.log("fileName: " + fileName);
    console.log("filePath: " + filePath);
  }else{
    res.status(200).send({message: 'No ha subido la imagen'});
  }
}
//Recuperar imagen de artista
function getImageFile(req, res) {
  var imageFile = req.params.imageFile;
  var pathImageFile = './uploads/artists/'+ imageFile;

  fs.exists(pathImageFile, function(exists){
    if(exists){
      res.sendFile(path.resolve(pathImageFile));
    }else{
      res.status(200).send({message: 'La imagen no existe'});
    }
  });

}
//exportamos modulos
module.exports = {
getArtist,
getArtists,
saveArtist,
updateArtist,
deleteArtist,
uploadImage,
getImageFile
}
