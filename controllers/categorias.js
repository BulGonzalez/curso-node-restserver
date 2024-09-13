const { response } = require("express");
const {Categoria} = require('../models')

//obtenerCategoria - Paginado - total - Populate
const obtenerCategoria = async (req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    //Parametro para las busquedas
    const query = {estado:true};

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde)) 
            .limit(Number(limite))
        ])

    res.json({
        total,
        categorias
    })
}

//obtenerCategorias por id - populate()
const obtenercategoriaID = async (req, res = response) => {
    const {id} = req.params; 
    const categoria = await Categoria.findById(id).populate('usuario','nombre');
    
    res.json(categoria);
}

const crearCategoria = async (req, res=response) => {
    const nombre = req.body.nombre.toUpperCase();
    //Existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //GENERAR DATA A GUARDAR.
    const data = {
        nombre,
        usuario: req.usuario._id //Es como Mongo lo guarda
    }
    //Se crea una nueva categoria con el modelo
    const categoria = new Categoria(data);

    //Save
    await categoria.save();
    //Impresion de la respuesta
    res.status(201).json(categoria);
}

//actualizarCategoria
const actualizarCategoria = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();
    //Existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`
        });
    }
    
    const {id} = req.params; 
    //Se extrae estado y usuario para que no se pueda mandar del body como peticion
    const {_id, estado, usuario, ...data} = req.body;

    //Se crea la data con el nombre que viene en el resto
    data.nombre = data.nombre.toUpperCase();
    //Se obtiene el suuario que se logueo con el token y modifico
    data.usuario = req.usuario._id;

    //new: true es para que se vean los datos actualizados
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.json({categoria})
}

//borrarCategoria - estado:false
const borrarCategoria = async (req, res) => {
    const {id} = req.params;
    const categoria = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true});
    res.json({categoria})    
}

module.exports = {
    crearCategoria,
    obtenerCategoria,
    obtenercategoriaID,
    actualizarCategoria,
    borrarCategoria
}