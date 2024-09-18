const { response, json } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {

    const {correo,password} = req.body;

    try {
        //Verificar el email existe
        //Se agrega return para que no continue el flujo
        const usuario = await Usuario.findOne({correo});
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario/pasword no son validos - correo'
            })
        }

        //El usuario esta activo
        if(!usuario.estado){  //estado== false
            return res.status(400).json({
                msg: 'Usuario/pasword no son validos - Estado: false'
            });
        }

        //Verificar psw
        //compareSync = recibe el psw del request y lo compara con el psw del usuario y regresa boleano
        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if(!validPassword) {
            return res.status(400).json({
                msg: 'Usuario/pasword no son validos - Password'
            });
        }

        // GENERAR EL JWT
        const token = await generarJWT (usuario.id);
        

        //No lleva Return res.json ya que es el ultimo procedimiento
        //NO se puede llamar dos veces res.json
        res.json({
           usuario,
           token
        })

        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
          msg: 'contactar Admin'  
        });
    }
    
}

const googleSingIn = async (req, res=response) => {
    const {id_token} = req.body;

    try{
        //googleVerify es una promesa se usa el await, por la funcion asincrona
        const {nombre, img, correo} = await googleVerify(id_token);
        
        //GENERAR LA REFERENCIA SI EL CORREO YA EXISTE EN BD
        //Se usa Let porque se vuelve a ocupar abajo
        let usuario = await Usuario.findOne({correo});

        if(!usuario){
            //Crear usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //El usuario en BD esta en estado false
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Hablar con admin - User bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT (usuario.id);

        res.json({
            usuario,
            token
        })

    }catch (error) {    
        res.status(400).json({
            ok: false,
            msg: 'Token no se pudo validar'
        })
    }
}

module.exports = {
    login,
    googleSingIn
}