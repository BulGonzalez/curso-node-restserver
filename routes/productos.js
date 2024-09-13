const {Router} = require('express');
const { check } = require('express-validator');
const {validarJWT, esAdminrole} = require ('../middlewares')

const { validarCampos } = require('../middlewares/validar-campos');
const { crearProducto, obtenerProductos, obtenerProductoID, actualizarProducto, borrarProducto } = require('../controllers/productos');
const { existeCategoria, existeProducto, categoriaFalse } = require('../helpers/db-validators');


const router = Router();

// //Obtener todas las categorias - Publico
router.get('/',obtenerProductos);

//Obtener producto por id- Publico
router.get('/:id',
    [
        check('id',"Id no valido en mongo").isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    obtenerProductoID
 );

//Crear producto - Privado - Con cualquier token valido
//Llamar el midleware de valdiaJWT
router.post('/', 
    [  //middleware
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        check('categoria', 'ID no valido de mongo').isMongoId(),
        check('categoria').custom(existeCategoria),
        validarCampos
    ], 
    crearProducto
);

//Actualizar - Privado - Con cualquier token valido
router.put('/:id', 
    [
        validarJWT,
        check('id',"Id no valido en mongo").isMongoId(),
        check('categoria').custom(existeCategoria),
        check('id').custom(existeProducto),
        validarCampos
    ],
    actualizarProducto
);

//Borrar producto - admin
router.delete('/:id', 
    [
        validarJWT,
        esAdminrole,
        check('id',"Id no valido en mongo").isMongoId(),
        check('id').custom(existeProducto),
        validarCampos
    ],
    borrarProducto
);

module.exports = router;