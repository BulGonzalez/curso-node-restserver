
// Se desestructurs 
// Se obtiene response de express
// Esto es para poder usar el res. si no Visual no sabe que tipo es
const {response} = require('express');

//Se corta el callback de /routes/usuarios
//Se crea una funcion de flecha 
//Se asigna a res el response para poder obtener los valores de res
const usuariosGet = (req, res = response) => {
    //Desestructura 
    const {q, nombre, apikey, pagina = 1, limite} = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        nombre,
        apikey,
        pagina,
        limite
    })
}

const usuariosPost = (req, res = response) => {
    //Se puede desestructurar el body para obtener solo los datos requeridos del JSON
    const {nombre, edad } = req.body
    
    res.json({
        msg: 'Post API - controlador',
        nombre,
        edad
    })
}

const usuariosPut= (req, res = response) => {
    //Se agrega el valor que se puso en la URL
    //Se desestructura en caso de tener mas paremtros
    const {id} = req.params; 

    res.json({
        msg: 'put API - controlador',
        id
    })
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch API - controlador'
    })
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    })
}

//Se exportan 
//Como son varios se usa un objeto
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}