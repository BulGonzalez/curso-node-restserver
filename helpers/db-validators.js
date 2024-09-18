const { Categoria, Usuario, Producto } = require('../models');
const Role = require('../models/role');

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

const existeCategoria = async( id )=> {
    const categoria = await Categoria.findById(id);

    if (!categoria) {
        throw new Error(`El id ${id} NO existe cat`)
    }
}

const categoriaFalse = async( id)=> {
    const {estado} = await Categoria.findById(id, {estado:true});
    
    if (!estado) {
        throw new Error(`La categoria ${id} NO existe`);
    }
}

const existeProducto = async( id )=> {
    const producto = await Producto.findById(id);

    if (!producto) {
        throw new Error(`El id ${id} NO existe ;P`)
    }
}

//Valdiar colecciones permitidas
const coleccionesPermitidas = (coleccion ='', colecciones=[]) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`${coleccion} no permitida, Permitidas : ${colecciones}`);
    }

    //Se usa true porque se esta mandando una funcion, porque se mandan argumentos
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioporID,
    existeCategoria,
    categoriaFalse,
    existeProducto,
    coleccionesPermitidas
}