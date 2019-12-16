const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const soldProductSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: 'Product' }
});

soldProductSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('SoldProduct', soldProductSchema);