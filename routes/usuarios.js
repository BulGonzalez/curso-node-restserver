// Crear una constante
// Desestructurar el paquete de express
// Saca la funcion de router 
const {Router} = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { usuariosGet, 
        usuariosPut, 
        usuariosPost, 
        usuariosPatch, 
        usuariosDelete } = require('../controllers/usuarios');
const { esRoleValido, 
        emailExiste,
        existeUsuarioporID
 } = require('../helpers/db-validators');

//llamar a la funcion de router
const router = Router();

//Se corta lo que esta en el metodo routes de la clase de server.js
//Se sustituye this.app por router
//La ruta que se ocupara es la que esta en server "/api/usuarios"
//El metodo de get se define en /controllers/usuarios
// No se esta ejecutando la funcion usuariosGet, se manda la referencia a la misma
//Cuando se llame los argumentos de request y response seran pasados a usuariosGet.
router.get('/', usuariosGet);

router.post('/', [
    check('nombre', 'Nombre obligatorio').notEmpty(),
    check('password', 'Password debe ser mayor a 6 caracteres').isLength({min:6}),
    check('correo', 'Correo no valido').isEmail(),
    //check('rol', 'Rol no valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    check('correo').custom(emailExiste),
    validarCampos //Revisara los errores si pasa continua si no ahi se detiene
] ,usuariosPost);

router.put('/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeUsuarioporID),
    check('rol').custom(esRoleValido),
    validarCampos  ]
,usuariosPut); //Se agrega el parametro que viajara al request

router.patch('/', usuariosPatch)

router.delete('/:id',[
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(existeUsuarioporID),
    validarCampos 
], 
usuariosDelete);

module.exports = router;
