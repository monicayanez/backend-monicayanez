const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/products.json');

class ProductsManager {
  constructor() {
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    if (fs.existsSync(productsFilePath)) {
      this.products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    }
  }

  saveProducts() {
    fs.writeFileSync(productsFilePath, JSON.stringify(this.products, null, 2));
  }

  getAllProducts(limit) {
    if (limit) {
      return this.products.slice(0, limit);
    }
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  addProduct(product) {
    const newId = (this.products.length ? (this.products[this.products.length - 1].id + 1) : 1);
    const newProduct = { id: newId, ...product, status: product.status ?? true };
    this.products.push(newProduct);
    this.saveProducts();
    return newProduct;
  }

  updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.saveProducts();
      return this.products[index];
    }
    return null;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      this.saveProducts();
      return true;
    }
    return false;
  }
}

module.exports = new ProductsManager();
