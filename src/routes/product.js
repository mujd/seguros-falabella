const { Router } = require('express');
const router = Router();
const Product = require('../models/product');

// ============================
// Mostrar todos los productos
// ============================
router.get('/', async(req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    try {
        const products = await Product.find({}, 'name sellIn price')
            .skip(desde)
            .limit(limite)
            .exec();
        Product.countDocuments({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                products,
                total: conteo
            });
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al cargar productos',
            error: err
        });
    }
});

// ============================
// Mostrar product por id
// ============================
router.get('/:id', async(req, res) => {
    let id = req.params.id;
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    let order = {};
    if (req.query.order == 'asc') {
        order = { order: 'asc' };
    } else {
        order = { order: 'desc' };
    }
    try {
        let products = await Product.findById(id)
            .sort(order)
            .skip(desde)
            .limit(limite)
            .exec();
        res.status(200).json({
            ok: true,
            products
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al cargar producto',
            error: err
        });
    }
});
// ======================
// Nueva producto
// ======================
router.post('/', async(req, res) => {
    const body = req.body;
    const product = new Product({
        name: body.name,
        sellIn: body.sellIn,
        price: body.price
    });
    try {
        let newProduct = await product.save();
        res.status(201).json({
            ok: true,
            product: newProduct
        });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Error al crear producto.',
                error: err
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al crear producto.',
            error: err
        });
    }
});

// ============================
// Actualizar producto
// ============================
router.put('/:id', async(req, res) => {
    let id = req.params.id;
    let productBody = req.body;
    let product;
    try {
        product = await Product.findByIdAndUpdate(id, productBody, { new: true, runValidators: false });
        res.status(200).json({
            ok: true,
            product
        });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({ ok: false, error: err });
        }
        if (!product) {
            return res.status(404).json({ ok: false, mensaje: 'El producto con el id ' + id + ' no existe', error: { mensaje: 'No existe un producto con ese ID' }, err });
        }
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar el producto.', error: err });
    }
});

// ============================
// Borrar products
// ============================
router.delete('/:id', async(req, res) => {
    let id = req.params.id;
    let product;
    try {
        product = await Product.findByIdAndRemove(id);
        if (product !== null) {
            res.status(200).json({
                ok: true,
                message: 'Producto Borrado exitosamente!',
                product
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto con el id ' + id + ' no existe',
                error: { message: 'No existe una producto con ese ID' }
            });
        }
    } catch (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar producto',
                error: err
            });
        }
    }
});

module.exports = router;