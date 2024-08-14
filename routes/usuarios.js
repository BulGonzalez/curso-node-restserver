// Crear una constante
// Desestructurar el paquete de express
// Saca la funcion de router 
const {Router} = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete } = require('../controllers/usuarios');

//llamar a la funcion de router
const router = Router();

//Se corta lo que esta en el metodo routes de la clase de server.js
//Se sustituye this.app por router
//La ruta que se ocupara es la que esta en server "/api/usuarios"
//El metodo de get se define en /controllers/usuarios
// No se esta ejecutando la funcion usuariosGet, se manda la referencia a la misma
//Cuando se llame los argumentos de request y response seran pasados a usuariosGet.
router.get('/', usuariosGet);

router.post('/', usuariosPost);

router.put('/:id', usuariosPut); //Se agrega el parametro que viajara al request

router.patch('/', usuariosPatch)

router.delete('/', usuariosDelete);

module.exports = router;
