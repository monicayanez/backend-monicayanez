const express = require('express');
const { create } = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');

const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('io', io);

const hbs = create({ extname: '.handlebars' });
app.engine('.handlebars', hbs.engine);
app.set('view engine', '.handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta para la vista principal
app.get('/', (req, res) => {
  const products = require('./dao/productsManager').getAllProducts();
  res.render('home', { products });
});

// Ruta para productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
  const products = require('./dao/productsManager').getAllProducts();
  res.render('realTimeProducts', { products });
});

// WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  const products = require('./dao/productsManager').getAllProducts();
  socket.emit('productList', { products });

  socket.on('newProduct', (product) => {
    const newProduct = require('./dao/productsManager').addProduct(product);
    io.emit('productList', { products: require('./dao/productsManager').getAllProducts() });
  });

  socket.on('deleteProduct', (productId) => {
    const success = require('./dao/productsManager').deleteProduct(Number(productId));
    if (success) {
      io.emit('productList', { products: require('./dao/productsManager').getAllProducts() });
    }
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server en puerto ${PORT}`);
});
