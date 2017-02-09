'use strict' //Controlador de usuario

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

//METODO TEST
function pruebas(req, res){
  res.status(200).send({
    message: 'Ok - Ejecutando funcion de prueba controlador usuario'
  });
}

//METODO SIGNUP
function saveUser(req, res){
    var user = new User();

    var params = req.body;
    console.log("params: " + params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if (params.password){
      //encriptamos la password
      bcrypt.hash(params.password, null, null, function(err, hash){
        user.password  = hash;
          if(user.name!= null && user.surname != null && user.email != null){
            //save
              user.save((err, userStored) => {
                if(err){
                  res.status(500).send({message: 'Error al guardar usuario'});
                }else{
                  if(!userStored){
                    res.status(404).send({message: 'No se ha registrado el usuario'});
                  }else{res.status(200).send({user: userStored});
                  }
                }
              });

          }else{
            res.status(500).send({message: 'Rellena todos los campos'});
          }
      });
    }else{
      //error
      res.status(500).send({message: 'Introduce la contraseña'});
    }

}

//METODO LOGIN
function loginUser(req, res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: 'Error en la peticion'});
        }else{
          if(!user){
              res.status(404).send({message: 'El usuario no existe'});
          }else{
            //valida contraseña
            bcrypt.compare(password, user.password, function(err, check){
              if(check){
                //devolver datos usuario
                if(params.gethash) {
                  //token
                  res.status(200).send({
                    token: jwt.createToken(user)
                  })
                }else{
                  res.status(200).send({user,   token: jwt.createToken(user)});
                }
              }else{
                //devolver error 404 password doesnt match
                res.status(404).send({message: 'El usuario no ha podido logearse'});
              }
            })
          }
        }
      }
     );
}

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;
  //Actualizamos user por id
  User.findByIdAndUpdate(userId, update, (err, userUpdated) =>{
    if(err){
      res.status(500).send({message: 'Error al actualizar el usuario'});
    }else{
      if(!userUpdated){
      res.status(404).send({message: 'El usuario no se ha podido actualizar'});
      }else{
        res.status(200).send({'Usuario antiguo': userUpdated, 'Cambios': update});
      }
    }
  });

}

function uploadImage(req, res) {
  var userId = req.params.id;
  var fileName = 'No hay fichero';

  if(req.files){
    var filePath = req.files.image.path;
    var fileSplit = filePath.split('\\');
    var fileName = fileSplit[2];

    var extSplit = fileName.split('\.');
    var fileExt = extSplit[1];

    if(fileExt == 'png' || fileExt == 'jpg' || fileExt == 'gif'){
          User.findByIdAndUpdate(userId, {image: fileName}, (err, userUpdated) =>{
            if(err){
              res.status(500).send({message: 'Error al actualizar  la imagen de usuario'});
            }else{
              if(!userUpdated){
              res.status(404).send({message: 'La imagen de usuario no se ha podido actualizar'});
              }else{
                res.status(200).send({'Usuario antiguo': userUpdated, 'Nueva imagen': fileName});
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

module.exports = {
  pruebas,
  saveUser,
  loginUser,
  updateUser,
  uploadImage
};
