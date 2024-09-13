const {Router} = require('express');
const { check } = require('express-validator');
const {validarJWT, esAdminrole} = require ('../middlewares')

const { validarCampos } = require('../middlewares/validar-campos');
const { crearCategoria, obtenerCategoria, obtenercategoriaID, actualizarCategoria, borrarCategoria } = require('../controllers/categorias');
const { existeCategoria, categoriaFalse } = require('../helpers/db-validators');

const router = Router();

//Obtener todas las categorias - Publico
router.get('/',obtenerCategoria);

//Obtener una categoria por id- Publico
router.get('/:id',
    [
        check('id',"Id no valido en mongo").isMongoId(),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    obtenercategoriaID
 );

//Crear categoria - Privado - Con cualquier token valido
//Llamar el midleware de valdiaJWT
router.post('/', 
    [  //middleware
        validarJWT,
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        validarCampos
    ], 
    crearCategoria
);

//Actualizar - Privado - Con cualquier token valido
router.put('/:id', 
    [
        validarJWT,
        check('id',"Id no valido en mongo").isMongoId(),
        check('id').custom(existeCategoria),
        check('nombre', 'El nombre es obligatorio').notEmpty(),
        validarCampos
    ],
    actualizarCategoria
);

//Borrar una categoria - admin
router.delete('/:id', 
    [
        validarJWT,
        esAdminrole,
        check('id',"Id no valido en mongo").isMongoId(),
        check('id').custom(categoriaFalse),
        check('id').custom(existeCategoria),
        validarCampos
    ],
    borrarCategoria
);

module.exports = router;