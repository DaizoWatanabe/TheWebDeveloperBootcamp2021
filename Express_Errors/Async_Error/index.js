const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');


const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

const categories = ['fruit', 'vegetable', 'dairy'];

//async utility to eliminate the need to type try/catch for every async function
//here we chain the .catch since it's a promise (async fns), no need to try {} every async rounting
function wrapAsync(fn) {
    return function(req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}

app.get('/products', wrapAsync(async (req, res, next) => {
    //trycatch is no longer necessary because we set a wrapasync function to return this function, catch any erros and pass it to next()
    //try {
    const { category } = req.query;
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
    }
    //} catch (e) {
    //    next(e);
    //}
}));

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

//example of try and catch to handle mongoose errors
//clean example with wrapasync
app.post('/products', wrapAsync(async (req, res, next) => {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.redirect(`/products/${newProduct._id}`)    
}));

app.get('/products/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const product = await Product.findById(id)
        if (!product) {
        //the example below will throw an error on the DB log due to render being executed afterwards
        //next( new AppError('Product  not found', 404))
        //so the solution is to return next and prevent res.render
        //return next(new AppError('Product  not found', 404));
        //but it's even better to try and catch and just throw the error since it will be catched and passed to next()
            throw new AppError('Product not found', 404);
        }
        res.render('products/show', { product })    
}));

app.get('/products/:id/edit', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }
    res.render('products/edit', { product, categories });
}));

app.put('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
}));

app.delete('/products/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
}));

app.use((err, req, res, next) => {
    const {status = 500, message = 'Something Went Wrong'} = err;
    res.status(status).send(message);
});


app.listen(3000, () => {
    console.log("APP IS LISTENING ON PORT 3000!")
});


