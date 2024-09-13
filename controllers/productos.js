const { response } = require("express");
const {Producto} = require('../models')

//obtenerProdcuto - Paginado - total - Populate
const obtenerProductos = async (req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    //Parametro para las busquedas
    const query = {estado:true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
            .skip(Number(desde)) 
            .limit(Number(limite))
        ])

    res.json({
        total,
        productos
    })
}

//obtenerProductos por id - populate()
const obtenerProductoID = async (req, res = response) => {
    const {id} = req.params; 
    console.log('Todo ok')
    const producto = await Producto.findById(id)
                    .populate('usuario','nombre')
                    .populate('categoria','nombre');
    res.json(producto);
}

const crearProducto = async (req, res=response) => {
    const {estado, usuario, ...body} = req.body
    //Existe una categoria con ese nombre
    const productoDB = await Producto.findOne({nombre: body.nombre});

    if(productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //GENERAR DATA A GUARDAR.
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }
    //Se crea una nueva categoria con el modelo
    const producto = new Producto(data);

    //Save
    await producto.save();
    //Impresion de la respuesta
    res.status(201).json(producto);
}

//actualizarProducto
const actualizarProducto = async (req, res) => {
    const nombre = req.body.nombre.toUpperCase();
    //Existe un producto con ese nombre
    const categoriaDB = await Producto.findOne({nombre});

    if(categoriaDB) {
        return res.status(400).json({
            msg: `la categoria ${categoriaDB.nombre}, ya existe`
        });
    }
    
    const {id} = req.params; 
    //Se extrae estado y usuario para que no se pueda mandar del body como peticion
    const {_id, estado, usuario, ...data} = req.body;

    //Se crea la data con el nombre que viene en el resto
    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
    
    //Se obtiene el usuario que se logueo con el token y modifico
    data.usuario = req.usuario._id;

    //new: true es para que se vean los datos actualizados
    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});

    res.json({producto})
}

//borrarProducto - estado:false
const borrarProducto = async (req, res) => {
    const {id} = req.params;
    const producto = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true});
    res.json({producto})    
}

module.exports = {
    obtenerProductos,
    obtenerProductoID,
    crearProducto,
    actualizarProducto,
    borrarProducto
}