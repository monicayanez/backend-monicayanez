const fs = require('fs');
const path = require('path');
const cartsFilePath = path.join(__dirname, '../data/carts.json');

class CartManager {
  constructor() {
    this.carts = [];
    this.loadCarts();
  }

  getAllCarts() {
    return this.carts;
  }
  
  loadCarts() {
    if (fs.existsSync(cartsFilePath)) {
      this.carts = JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
    }
  }

  saveCarts() {
    fs.writeFileSync(cartsFilePath, JSON.stringify(this.carts, null, 2));
  }

  createCart() {
    const newId = this.carts.length ? this.carts[this.carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    this.carts.push(newCart);
    this.saveCarts();
    return newCart;
  }

  getCartById(id) {
    return this.carts.find(cart => cart.id === id);
  }

  addProductToCart(cartId, productId) {
    const cart = this.getCartById(cartId);
    if (cart) {
      const existingProduct = cart.products.find(p => p.product === productId);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
      this.saveCarts();
      return cart;
    }
    return null;
  }
}

module.exports = new CartManager();
