const express = require('express');
const router = express.Router();
const productsManager = require('../dao/productsManager');

router.get('/', (req, res) => {
    const limit = parseInt(req.query.limit, 10);
    const products = productsManager.getAllProducts(limit);
    res.json(products);
});

router.get('/:pid', (req, res) => {
    const productId = Number(req.params.pid);
    const product = productsManager.getProductById(productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const newProduct = productsManager.addProduct(req.body);
    req.io.emit('productList', { products: productsManager.getAllProducts() });
    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const updatedProduct = productsManager.updateProduct(Number(req.params.pid), req.body);
    if (updatedProduct) {
        req.io.emit('productList', { products: productsManager.getAllProducts() });
        res.json(updatedProduct);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    const success = productsManager.deleteProduct(Number(req.params.pid));
    if (success) {
        req.io.emit('productList', { products: productsManager.getAllProducts() });
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;
