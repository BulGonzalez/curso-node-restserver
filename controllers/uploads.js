const  path  = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const {subirArchivo} = require('../helpers'); //solo se dice la carpeta raiz porque ya esta en el indez todo

const {Usuario, Producto} = require('../models/index');

const cargarArchivos = async (req, res = response) => {

    //el codigo se movio a un helpers, para poder ocuparlos en otros controladores
    
    //Se usa TRy para poder mandar el error al response y no se quede colgada con el mensaje en consola
    //undefine significa que tomara las extenciones permitidas por default definidas
    try {
        const nombre = await subirArchivo(req.files, undefined , 'imgs');
        res.json({nombre })
    }catch (msg){
        res.status(400).json({msg })
    }
}

const actualizarImagen = async (req, res =response)=> {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Opcion no programada' })
    }

    //Limpiar imagenes previas
    //Si la propiedad de img existe en el modelo
    if(modelo.img) {
        //borrar imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
    }

    const nombre = await subirArchivo(req.files, undefined , coleccion);
    modelo.img = nombre;

    await modelo.save();

    res.json({modelo})
}

const actualizarImagenCloudinary = async (req, res =response)=> {
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Opcion no programada' })
    }

    //Limpiar imagenes previas del modelo
    //Obtener el nombre que esta en la nube
    if(modelo.img) {
        // Separar el valor de img: https://res.cloudinary.com/djiyluaod/image/upload/v1726689706/tm29pwzwafu99jnm1fon.png",
        const nombreArr = modelo.img.split('/');
        //Obetenr la ultima posicion /tm29pwzwafu99jnm1fon.png
        const nombre = nombreArr[nombreArr.length -1 ];
        //Desextructura por "." y obtiene la primera parte
        const [public_id] = nombre.split('.');
        //Eliminacion
        cloudinary.uploader.destroy(public_id);
    }

    //Se mandara el valor de la propiedad "PathTempory" de files.archivo
    // .upload: regresa una promesa que vien con la informacion de la response 
    // Se peude extraer el response del awwait.
    const {tempFilePath} = req.files.archivo;
    //De toda la respuesta solo se etrae secure_url, es la ruta de la imagen 
    //Ese valor se le asigna al valor img del modelo de usuario o producto.
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);
    
    modelo.img = secure_url;
    await modelo.save();

    res.json({modelo})
}

const mostrarImagen = async (req, res) =>{
    const {id, coleccion} = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }
            break;
        default:
            return res.status(500).json({ msg: 'Opcion no programada' })
    }

    //sendfile : Mostrar imagen 
    if(modelo.img) {
        //borrar imagen del servidor
        const pathImagen = path.join(__dirname,'../uploads', coleccion, modelo.img)
        if(fs.existsSync(pathImagen)){
            return res.sendFile(pathImagen);
        }
    }

    const imagenNotFound = path.join(__dirname,'../assets/no-image.jpg')
    res.sendFile(imagenNotFound);
    
}

module.exports = {
    cargarArchivos,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}