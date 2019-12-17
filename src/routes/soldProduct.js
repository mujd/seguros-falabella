const mongoose = require('mongoose');
const { Router } = require('express');
const router = Router();
const SoldProduct = require('../models/soldProduct');
const Product = mongoose.model('Product');

// ============================
// Listar y evaluar todos los productos vendidos
// ============================
router.get('/evaluateProducts/:days', async(req, res) => {
    let days = Number(req.params.days);
    let daysCounted = 0;
    try {
        await SoldProduct.find({}).populate('product', 'name sellIn price').exec((err, soldProductDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error cargando productos vendidos',
                    error: err
                });
            }
            let json = [];
            while (daysCounted < days) {
                daysCounted++;
                json.push({
                    dia: daysCounted - 1,
                    detalle: []
                });
                productRules(json, soldProductDB, daysCounted, days);
            }
            res.status(200).json(json);
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al cargar los productos vendidos',
            error: err
        });
    }
});

function productRules(json, soldProductDB, daysCounted, days) {
    for (var item in soldProductDB) {
        let anterior_id = null || undefined || 0;
        let productName = soldProductDB[item].product.name;
        let productSellIn = soldProductDB[item].product.sellIn;
        let productPrice = soldProductDB[item].product.price;
        if (productName === 'Full cobertura') {
            productSellIn -= daysCounted - 1;
            if (daysCounted <= 10) {
                productPrice += daysCounted - 2;
            } else if (daysCounted <= 5) {
                productPrice += daysCounted - 3;
            } else {
                productPrice += daysCounted - 1;
            }
            if (productSellIn <= 0) {
                productPrice = 0;
            }
        } else if (productName === 'Mega cobertura') {
            productPrice = 180;
            if (productSellIn <= 0) {
                productSellIn = 1;
            }
        } else if (productName === 'Full cobertura Super duper') {
            productSellIn -= daysCounted - 1;
            if (daysCounted <= 10) {
                productPrice += daysCounted - 2;
            } else if (daysCounted <= 5) {
                productPrice += daysCounted - 3;
            } else {
                productPrice += daysCounted - 1;
            }
            if (productSellIn <= 0) {
                productPrice = 0;
            }
        } else if (productName === 'Baja cobertura') {
            productSellIn -= daysCounted - 1;
            productPrice -= daysCounted - 1;
        } else if (productName === 'Super avance') {
            productSellIn -= daysCounted - 1;
            productPrice -= (daysCounted - 1) * 2;
        } else if (productSellIn < 0) {
            productPrice -= discountPrice - 1;
        } else if (productName !== 'Mega cobertura' && productPrice >= 100) {
            productPrice = 100;
        }
        if (soldProductDB[item].id != anterior_id) {
            json[json.length - 1].detalle.push({
                name: productName,
                sellIn: productSellIn,
                price: productPrice
            });
            anterior_id = soldProductDB[item]._id;
        }
    }
    return json;
}
// ============================
// Listar todos los productos vendidos
// ============================
router.get('/', async(req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    try {
        const products = await SoldProduct.find({})
            .skip(desde)
            .limit(limite)
            .populate('product', 'name sellIn price')
            .exec();
        SoldProduct.countDocuments({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                products,
                total: conteo
            });
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al cargar los productos vendidos',
            error: err
        });
    }
});

// ============================
// Mostrar productos vendidos por id
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
        let products = await SoldProduct.findById(id)
            .sort(order)
            .skip(desde)
            .limit(limite)
            .populate('product', 'name sellIn price')
            .exec();
        res.status(200).json({
            ok: true,
            products
        });
    } catch (err) {
        res.status(500).json({
            ok: false,
            mensaje: 'Error al cargar los producto vendido con id: ' + id,
            error: err
        });
    }
});
// ======================
// Nuevo producto vendido
// ======================
router.post('/:id', async(req, res) => {
    const body = req.body;
    const soldProduct = new SoldProduct({
        product: req.params.id
    });
    try {
        let newProduct = await soldProduct.save();
        res.status(201).json({
            ok: true,
            soldProduct: newProduct
        });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Error al vender producto.',
                error: err
            });
        }

        return res.status(500).json({
            ok: false,
            mensaje: 'Error al vender producto.',
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
    let soldProduct;
    try {
        soldProduct = await SoldProduct.findByIdAndUpdate(id, productBody, { new: true, runValidators: false });
        res.status(200).json({
            ok: true,
            soldProduct
        });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            return res.status(409).json({ ok: false, error: err });
        }
        if (!soldProduct) {
            return res.status(404).json({ ok: false, mensaje: 'El producto con el id ' + id + ' no existe', error: { mensaje: 'No existe un producto con ese ID' }, err });
        }
        res.status(500).json({ ok: false, mensaje: 'Error al actualizar el producto.', error: err });
    }
});

// ============================
// Borrar producto vendido
// ============================
router.delete('/:id', async(req, res) => {
    let id = req.params.id;
    let soldProduct;
    try {
        soldProduct = await SoldProduct.findByIdAndRemove(id);
        if (soldProduct !== null) {
            res.status(200).json({
                ok: true,
                message: 'SoldProduct vendido Borrado exitosamente!',
                soldProduct
            });
        } else {
            return res.status(400).json({
                ok: false,
                mensaje: 'El producto vendido con el id ' + id + ' no existe',
                error: { message: 'No existe una producto con ese ID' }
            });
        }
    } catch (err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar producto vendido',
                error: err
            });
        }
    }
});

module.exports = router;