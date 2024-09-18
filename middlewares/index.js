//Se crean constante como referencia del archivo.

const validarCampos  = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar-jwt');
const validarRoles = require('../middlewares/validar-roles');
const valdiarArchivo = require('../middlewares/validar-archivo')
//Se usa el operador ...
//Estaran todos las validaciones, funciones, Resultadosr, modulos de cada uno
module.exports ={
    ...validarCampos,
    ...validarJWT,
    ...validarRoles,
    ...valdiarArchivo
}