const express = require('express');
const bodyParser = require('body-parser');
const menuData = require('./menu.json');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());


app.get('/categories', (req, res) => {
    try {
        const categories = menuData.map(category => ({
            id: category.id,
            name: category.name,
        }));
        res.json(categories);
    } catch (error) {
        console.error('erreur :', error);
        res.status(500).send('Erreur serveur');
    }
});


app.get('/categories/:id', (req, res) => {
    try {
        const categoryId = parseInt(req.params.id);
        const category = menuData.find(category => category.id === categoryId);

        if (!category) {
            return res.status(404).json({ error: 'Catégorie non trouvée' });
        }

        const categoryDetails = {
            id: category.id,
            name: category.name,
            products: category.products.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                supplements: product.supplements.map(supplement => ({
                    id: supplement.id,
                    name: supplement.name,
                    price: supplement.price,
                    happyHourPrice: supplement.happyHourPrice,
                })),
            })),
        };

        res.json(categoryDetails);
    } catch (error) {
        console.error('erreur', error);
        res.status(500).send('Erreur serveur');
    }
});


app.get('/search/:keyword', (req, res) => {
    try {
        const keyword = req.params.keyword.toLowerCase();
        const matchingProducts = [];

        menuData.forEach(category => {
            category.products.forEach(product => {
                if (product.name.toLowerCase().includes(keyword)) {
                    matchingProducts.push({
                        category: category.name,
                        product: product.name,
                        price: product.price,
                    });
                }
            });
        });

        res.json(matchingProducts);
    } catch (error) {
        console.error('erreur ', error);
        res.status(500).send('Erreur serveur');
    }
});


app.put('/removeSupplements/:productId/:supplementId', (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const supplementId = parseInt(req.params.supplementId);

        const product = menuData
            .flatMap(category => category.products)
            .find(product => product.id === productId);

        if (!product) {
            return res.status(404).json({ error: 'Produit non trouvé' });
        }

        const updatedProduct = {
            ...product,
            supplements: product.supplements.filter(supplement => supplement.id !== supplementId),
        };

        res.json(updatedProduct);
    } catch (error) {
        console.error('erreur ', error);
        res.status(500).send('Erreur serveur');
    }
});



app.listen(PORT, () => {
    console.log(`Serveur is running on port ${PORT}`);
});
