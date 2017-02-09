'use strict' //Controlador de artistas
//Cargamos filesystem y path
var fs = require('fs');
var path = require('path');
//cargamos modelos
var Album = require('../models/album');
var Artist = require('../models/artist');
var Song = require('../models/song');
//Metodos
//ver artistas
function getArtist(req, res) {
  res.status(200).send({message: 'Metodo artist'});
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
//exportamos modulos
module.exports = {
getArtist,
saveArtist

}
