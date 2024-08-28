const mongoose = require('mongoose');


const dbconnection = async () => {
    try {
        //Esto regresa una promesa 
        //Como es una funcion async se puede usar el await para que espera la conexion
        //Se agrega la URL y objetos que pide mongoose
        await mongoose.connect(process.env.MONGODB_CNN, {
            //useNewUrlParser: true, Ya no es compatible con nueva version
            //useUnifiedTopology: true, Ya no es compatible con nueva version
            //useCreateIndex: true,  Ya no es compatible con nueva version
            //useFindAndModify: false  Ya no es compatible con nueva version
        });
        console.log('BD online');
    } catch(error) {
        console.log(error);
        throw new Error ('Error de conexion')
    }
}


module.exports = {
    dbconnection
}