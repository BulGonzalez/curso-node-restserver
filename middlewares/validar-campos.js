const { validationResult } = require('express-validator');

//Este middleware puede usar el req y res
//Se agrega un nuevo parametro "next" 
//SI llega al punto de next, sigue con el siguiente middleware (check) de Routes/usuarios
//SI NO hay mas continua con el controlador
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validarCampos
}