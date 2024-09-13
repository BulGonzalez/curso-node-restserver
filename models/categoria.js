const {Schema, model} = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        //Tiene que ser otro objeto que esta en mongo
        type: Schema.Types.ObjectId,
        //referencia del otro esquema en singular, tiene que ser igual
        ref: 'Usuario',
        required: true
    }
});


    
CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...data} = this.toObject();
    return data
}

module.exports = model ('Categoria', CategoriaSchema)