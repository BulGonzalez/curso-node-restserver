const path = require('path'); //Objeto de JS para crear url de ruta
const { v4: uuidv4 } = require('uuid');

// PROSESAS = Cuando algo debe salir bien o mal
// EXTENSINES REACTIVAS = Cuando se debe cancelar promesa o estar escuchando algo connstantemente

//Se recibe files = req.files
//Se reciben estensiones validas, se igualan por default
//Nombre de la carpeta que se necesita 
const subirArchivo = (files, extensionesValidas = ['png','jpg','jpeg', 'gif'], carpeta='') => {

    return new Promise ((resolve, rejected) => {
        const { archivo } = files; //req.files
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[nombreCortado.length-1];
    
        //Valdiar la extension
        //const extensionesValidas = ['png','jpg','jpeg', 'gif'];
        if(!extensionesValidas.includes(extension)){
            //Se cambia return x reject porque no tenemos el res
            return rejected(`${extension} Extension no valida, ${extensionesValidas}`)
            // return res.status(400).json({
            //     msg: `${extension} Extension no valida, ${extensionesValidas}`
            // })
        }
    
        //Con uso de "path" se crea la ruta saliendo de controlador para entrar a la capeta uploads
        //Agregar el name de la propiedad del archivo
        const nombreTemp = uuidv4() + '.' + extension;
        //Dirname = la ruta donde me encuentro
        //si carpeta es vacia no hace nada
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);
    
        //Se llama la funcion "mv" (mover) que tiene el archivo
        archivo.mv(uploadPath, (err) => {
            if (err) {
                rejected(err)
                //return res.status(500).send(err);
            }
            //Se cambia el res.json x Resolve = exitoso
            // res.json({
            //     msg: 'Archivo cargado' + uploadPath
            // });

            //Solo se manda el nombre ya que la ruta es indistinta 
            resolve(nombreTemp)
        });
    });
   
}

module.exports = {
    subirArchivo
};