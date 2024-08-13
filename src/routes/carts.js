const express = require('express');
const router = express.Router();
const cartManager = require('../dao/cartsManager');

router.post('/', (req, res) => {
  const newCart = cartManager.createCart();
  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const cart = cartManager.getCartById(Number(req.params.cid));
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cart = cartManager.getCartById(Number(req.params.cid));
  const productId = Number(req.params.pid);
  if (cart) {
    const updatedCart = cartManager.addProductToCart(cart.id, productId);
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

router.get('/', (req, res) => {
  const carts = cartManager.getAllCarts();
  res.json(carts);  
});

module.exports = router;
