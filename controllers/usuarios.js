
// Se desestructurs 
// Se obtiene response de express
// Esto es para poder usar el res. si no Visual no sabe que tipo es
const {response} = require('express');
const Usuario = require('../models/usuario'); //Se crea con U mayuscula permite crear instancias del modelo
const bcryptjs = require ('bcryptjs');


//Se corta el callback de /routes/usuarios
//Se crea una funcion de flecha 
//Se asigna a res el response para poder obtener los valores de res
const usuariosGet = async (req, res = response) => {
    //Desestructura 
    //Si no se nevia el valor en la url, se pueden enviar un valor por defecto
    //const {q, nombre, apikey, pagina = 1, limite} = req.query;

    //Seran los usuario que se een de la BD 
    const {limite = 5, desde = 0} = req.query;
    //Parametro para las busquedas
    const query = {estado:true};

    /// CODIGO SINCRONO --------------
    //hace una desestrucutracion buscando solo estado en true
    // const usuarios = await Usuario.find(query)
    // .skip(Number(desde)) //Se parsea a un numero para que no truene al enviar un string
    // .limit(Number(limite)); //Se parsea a un numero para que no truene al enviar un string
    
    // const total = await Usuario.countDocuments(query);

    // CODIGO ASINCRONO --------------
    //enviar todas las peticiones de manera simulatanea
    //Y no esperar el await de ada ya que pueden tardar segundos y una debe esperar a la otra
    //.promise ya es una funcion de JS inetgrada parte de las promesas
    //.all mandar una rreglo con todas las promesas que quiere ejecutar
    //Se coloca el await para que espere la resolucion de ambas promesas
    //Se desestrucutra e arreglo no objeto, cada nombre corresponde a la promesa
    const [total, usuarios] = await Promise.all([
        //1er promesa
        Usuario.countDocuments(query),
        //2da promesa
        Usuario.find(query)
            .skip(Number(desde)) //Se parsea a un numero para que no truene al enviar un string
            .limit(Number(limite))
        ])

    res.json({
        total,
        usuarios
    })
}

const usuariosPost = async (req, res = response) => {
    
    
    //Se puede desestructurar el body para obtener solo los datos requeridos del JSON
    //const {nombre, edad } = req.body;
    //const body = req.body
    //const {google, ...resto}  ---> Una manera de excluir campos y mandar el resto
    const { nombre, correo, password, rol } = req.body;
    //Si agrega un campo adicional que no este en el modelo, mongoos no lo dejara agregar
    //Creacion de la instancia
    //const usuario = new Usuario(body); //Aqui se diferencia en usar la "U" mayuscula
    //Con estos datos seran para crear el usuario
    const usuario = new Usuario({nombre, correo, password, rol});
    
    // Verificar si el correo existe.
    //Se eliminar de aqui por optimizacion y se va a 


    // Encriptar la contra
    //Por default da 10 vueltas la encriptacion
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    
    //Decir que se guarde la informacion en BD
    await usuario.save();

    res.json({
        usuario
        //nombre,
        //edad
    })
}

const usuariosPut= async (req, res = response) => {
    //Se agrega el valor que se puso en la URL
    //Se desestructura en caso de tener mas paremtros
    const {id} = req.params; 
    const {password, google, ...resto} = req.body;

    //Validar contra BD

    if (password){
        //encriptar psw
        const salt = bcryptjs.genSaltSync();
        //a resto se va arestablecer el psw
        resto.password = bcryptjs.hashSync(password, salt);
    }
    //Buscar elemento por el id y lo actualiza
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json({usuario})
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'Patch API - controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;

    //const uid = req.uid;
    //Borrar fisicamente.
    //const usuario = await Usuario.findByIdAndDelete(id);
    
    //USUARIO ELIMINADO
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});
    
    //USUARIO AUNTENTICADO
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
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