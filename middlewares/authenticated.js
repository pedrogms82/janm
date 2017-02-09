'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'claveSecreta';


exports.ensureAuth = function (req, res, next){
  if(!req.headers.authorization){
  return  res.status(403).send({message: 'No autorizado'});
  }

  var token = req.headers.authorization.replace(/['"]+/g,'');

  try{
      var payload = jwt.decode(token, secret);
        if (payload.exp <= moment().unix()){
            return  res.status(401).send({message: 'Token expirado'});
        }
  }catch(ex){
      console.log("error token: " + ex);
      return  res.status(404).send({message: 'Token No valido'});
  }
  req.user = payload;
  console.log("payload: " + payload);
  next();
};
