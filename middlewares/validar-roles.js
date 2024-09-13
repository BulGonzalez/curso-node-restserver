const { response } = require('express');

const esAdminrole = (req, res = response, next) => {
    
    //validarJWT: lee el  JSW y lee e usuario y estable ce la info en el req
    //Por ende este middlware que es despues tiene acceso al usuario
    //Ya no se tiene que hacer peticion a bd, validaciones, etc..
    //Solo leer el request

    if(!req.usuario) { //si req es undefine
        return res.status(500).json({
            msg: 'Se quiere valdiar el role sin validar el token primero'
        });
    }
    
    const {rol, nombre} = req.usuario;

    if(rol !=='ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es Administrador`
        });
    }
    next();
}

//... lo une y crea un arreglo
//la funcion tiene que regresar una funcion
const tienerole = (...roles) => {

    //retorna la funcion que se ejecutara en la ruta
    return (req, res = response, next) => {
        
        if(!req.usuario) { //si req es undefine
            return res.status(500).json({
                msg: 'Se quiere valdiar el role sin validar el token primero'
            });
        }
        //Valida si los roles permitidos viene en el requeest
        if (!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg: `El servicio requiere alguno de estos roles: ${roles}`
            });
        }
        next();
    }
}

module.exports = {
    esAdminrole,
    tienerole
}