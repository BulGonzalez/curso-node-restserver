const express = require('express');
const cors = require('cors');

// Crea en el servidor, que cuando se lance una nueva instancia va a crear la aplicacion de 
// Espress como una propiedad de la misma clase del servidor 
//Se crea la variable de PORT
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT; //Se declara el puerto del archivo .env
        this.usuarioPath = '/api/usuarios'; //Sea visible la ruta de nuestro server.
        // Midlewares
        this.midlewares();
        //RUTAS DE APLICACION
        this.routes(); //Cuando se llama el constructor llama a las rutas, 
    }

    midlewares(){
        //CORS
        this.app.use( cors () )

        //"use" significa que usare midleware
        // Directorio Publico.
        this.app.use(express.static('public'));
        //lectura y parseo del body
        this.app.use(express.json());
    }
//This.app es lo mismo que app
    routes() {
        //configurar las rutas de user.js
        //Se usa un midleware condicional
        // Se crea primero el path
        // Se agrega el require de las rutas
        this.app.use(this.usuarioPath, require('../routes/usuarios'));
    }

//Se crea un metodo para que este escuchando 
//La variable de PORT de .env se puede dejar aqui y funcionaria bien 
//Pero puede que uno no sepa donde esta le puerto
//y mejor se hace visible a todo el mundo en el contructor 
    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
          });
    }
}

module.exports = Server;