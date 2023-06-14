const { createProduct, getAllProduct, editProductById, deleteProductById, getProductById } = require('./product.dao');


// Create Product ---- Admin

const addProduct = async (req, res) => {
    try {
        let data = req.body;
        if (!data) return res.status(422).json({ message: 'Please Enter Details' });
        const product = await createProduct(data);
        return res.status(201).json({ message: 'Product Created Successfully' });
    } catch (e) {
        res.status(500).json({ message: e })
    }
}


//Get All Products

const getProducts = async (req, res) => {
    try {
        const products = await getAllProduct();
        if (!products) return res.status(404).json({ message: 'There is No Product' });
        return res.status(200).json({ products })
    } catch (e) {
        res.status(500).json({ message: e })
    }
}


//Get Product Details

const getProductDetail = async (req, res) => {
    try {
        let productId = req.params.productId;
        if (!productId) return res.status(404).json({ message: 'Unprocessable entity' });
        const product = await getProductById(productId);
        if (!product) return res.status(404).json({ message: 'There is No Product' });
        return res.status(200).json({ product })
    } catch (e) {
        res.status(500).json({ message: e })
    }
}



//Update Product

const updateProduct = async (req, res) => {
    try {

        let productId = req.params.productId;
        let productObj = req.body;
        if (!productId || !productObj) return res.status(422).json({ message: 'Unprocessable Entity' });
        let product = await editProductById(productId, productObj);

        if (!product) return res.status(204).json({ message: 'Updatation Failed' });

        return res.status(202).json({ message: 'Updated Successfully', product });

    } catch (e) {
        res.status(500).json({ message: e })
    }
}

const deleteProduct = async (req, res) => {
    try {
        let productId = req.params.productId;
        if (!productId) return res.status(422).json({ message: 'Unprocessable Entity' });
        let product = await deleteProductById(productId);
        if (!product) return res.status(204).json({ message: 'Deletion Failed' });
        return res.status(200).json({ message: 'Deleted Successfully' });
    } catch (e) {
        res.status(500).json({ message: e })
    }
}


module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    getProductDetail
}