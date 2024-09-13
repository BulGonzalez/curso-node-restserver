const {Router} = require('express');
const { buscar } = require('../controllers/buscar');

const router = Router();

//Las busquedas son Get y los argumentos va por la url
router.get('/:coleccion/:termino', buscar);

module.exports = router;