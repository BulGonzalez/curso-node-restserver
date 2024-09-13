const {Router} = require('express');
const { check } = require('express-validator');
const { login, googleSingIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// tiene que acceder a traves de /login
// No se coloca /auth ya que se definio en el server 
router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'Psw es obligatorio').notEmpty(),
    validarCampos
], login );

router.post('/google', [
    check('id_token', 'Id_token obligatorio').notEmpty(),
    validarCampos
], googleSingIn );


module.exports = router;