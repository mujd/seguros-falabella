const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const createdDate = new Date().toLocaleString();
const validNames = {
    values: ['Full cobertura', 'Mega cobertura', 'Full cobertura Super duper', 'Baja cobertura', 'Super avance'],
    message: '{VALUE} no es un nombre válido'
};
const productSchema = new Schema({
    name: { type: String, required: [true, validNames.message], enum: validNames },
    sellIn: { type: Number, default: 0, min: 0 },
    price: { type: Number, default: 0, min: 0 },
    status: { type: Boolean, default: true },
    createdAt: { type: Date, default: createdDate }
});

productSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Product', productSchema);