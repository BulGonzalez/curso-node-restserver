const {Router} = require('express');
const { check } = require('express-validator');

const {validarCampos, valdiarArchivoSubir} = require('../middlewares');
const { cargarArchivos, actualizarImagen, mostrarImagen, actualizarImagenCloudinary,  } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const router = Router();

//Si no se actuliza nada en BD y solo se sube un archivo,
//Es un nuevo recurso y se ocupa router.post
//Si se requiere actulizar seria con router.put

// "/" = No es la raiz de la app, es donde sea que el servidor defina que quiere usar esa ruta 
router.post('/', valdiarArchivoSubir,cargarArchivos);

router.put('/:coleccion/:id',
    [
        valdiarArchivoSubir,
        check('id','ID debe ser de mongo').isMongoId(),
        //c= colecciones que se esta recibiendo del PUT
        //coleccionesPermitidas = es un helper que se le manda la coleccion (c) + colecciones permitidas definidas
        check('coleccion').custom(c => coleccionesPermitidas (c,['usuarios','productos'])),
        validarCampos
    ], actualizarImagenCloudinary) 
    //actualizarImagen)

router.get('/:coleccion/:id',
    [
        check('id','ID debe ser de mongo').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas (c,['usuarios','productos'])),
        validarCampos
    ], 
    mostrarImagen)

module.exports = router;