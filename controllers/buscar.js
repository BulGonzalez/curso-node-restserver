const {response, request} = require('express');
const { isValidObjectId } = require('mongoose');
const {Usuario, Categoria, Producto} = require('../models');



const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

//Se recibe el temrino como parametros
//Recibe el response como argumento del switch para tenornar la respuesta
const buscarUsuario = async(termino='',res=response) => {
    //objectID es de Mongose que ayuda a validar si es valido el ID de mongo
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const usuario = await Usuario.findById(termino);
        //Se manda un arreglo "results" con todos los que necuentra
        return res.json({
            //Se agrega ternario en case de haber null mandar vacio el arreglo
            results: (usuario) ? [usuario] : []
        })
    }

    //USO DE EXPRESION REGULAR PARA BUSQUEDA INSESIBLES
    //no se imparta RegExp porque es de JS
    const regex = new RegExp( termino, 'i')

    //BUSQUEDA POR NOMBRE O CORREO CON USO DE $OR, nombre = termno
    //EVITAR ESTADOS EN FALSE
    const usuarios = await Usuario.find({
        $or: [{nombre: regex}, {correo: regex}],
        $and: [{estado: true}]
    })
    res.json({
        results: usuarios
    })

}

const buscarCategorias = async(termino='',res=response) => {
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    const regex = new RegExp( termino, 'i')

    const categorias = await Categoria.find({ nombre:regex, estado: true })
    res.json({
        results: categorias
    })
}

const buscarProductos = async(termino='',res=response) => {
    const esMongoID = isValidObjectId(termino);

    if(esMongoID){
        const producto = await Producto.findById(termino).populate('categoria','nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    const regex = new RegExp( termino, 'i')

    const productos = await Producto.find({nombre: regex, estado:true  }).populate('categoria','nombre');
    res.json({
        results: productos
    })
}


const buscar = (req = request, res = response) => {

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuario(termino, res);
        break;
        case 'categorias':
            buscarCategorias(termino, res);
        break;
        case 'productos':
            buscarProductos(termino,res);
        break;
        default:
            res.status(500).json({
                msg: 'Busqueda no programada OMG (--)'
            })
    }
}

module.exports = {
    buscar
}