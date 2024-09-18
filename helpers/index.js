const dbValidator = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');

// "..." = Exporta toodo del archivo funciones, variables, etc
module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo
}
