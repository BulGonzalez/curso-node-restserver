const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`)
    }
}

const emailExiste = async(correo='')=> {
    const existeemail = await Usuario.findOne({correo});
    if (existeemail) {
        // return res.status(400).json({
        //     msg: 'Ese correo ya existe'
        // });
        throw new Error(`El correo ${correo} existe`)
    }
}

const existeUsuarioporID = async( id )=> {
    const existeUusuario = await Usuario.findById(id);
    if (!existeUusuario) {
        // return res.status(400).json({
        //     msg: 'Ese correo ya existe'
        // });
        throw new Error(`El id ${id} NO existe`)
    }
}



module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioporID
}