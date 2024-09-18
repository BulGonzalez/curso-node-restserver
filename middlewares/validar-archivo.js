const valdiarArchivoSubir =(req, res, next) => {
    //Si no hay Request manda msg
    //Debe venir una propiedad del archivo
    //Debe venir el nombre "archivo" que se define
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).send('No hay archivos que subir. - Middleware');
        return;
    }

    next();
}

module.exports = {
    valdiarArchivoSubir
}