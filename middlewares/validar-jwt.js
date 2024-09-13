const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            msg: ' no hay token en la peticion'
        });
    }

    try { //Si da un error se captura en el catch
        const {uid} = jwt.verify(token,process.env.SECRETORPRIVATEKEY);

        //Leer usuario que corresponde al uid.
        //Lo que encuentra en uid lo almacena en usuario
        const usuario = await Usuario.findById(uid)

        //Validar si usuario logeado exista
        if(!usuario){
            return res.status(401).json({
                msg: 'Token no valido - usuario no existente BD'
            }) 
        }

        //Validar si UID no es false
        //si Usurio logueado esta en false no pueda eliminar
        if(!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no valido - usuario con estado false'
            })
        }
        
        //Se coloca en el request
        //NO sobreEscribir los headers
        //SE crea una propiedad nueva
        req.usuario = usuario; 
        
        next();
    }catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })
    }

    
}

module.exports ={
    validarJWT
}