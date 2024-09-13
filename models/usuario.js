const {Schema, model} = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'Correo obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password obligatorio']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        require: true,
        emun: ['ADMIN_ROLE','USER_ROLE'] //Solo se puede usar esos valores
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


//Sobreescribir el metodo toJSON
//Tiene que ser una funcion normal 
//Poruqye se usa el .this para hacer referencia a la instancia creada
//no de flecha
UsuarioSchema.methods.toJSON = function() {
    //Esto genera la instancia con los valores de nombre, correo, un objeto de JS
    //Saca la version y pasword
    //y lo demas lo llama en un nuevo llamado usuario
    const {__v, password, _id, ...usuario} = this.toObject();
    usuario.uid = _id; //Se cambia _id se vea como uid
    return usuario
}

module.exports = model('Usuario', UsuarioSchema) //por defeault le agrega una S "usuarios"