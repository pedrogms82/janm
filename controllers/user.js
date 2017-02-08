'use strict' //Controlador de usuario

var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');

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
    console.log(params);

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

                }else{
                  res.status(200).send({user});
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

module.exports = {
  pruebas,
  saveUser,
  loginUser
};
