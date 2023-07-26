import Product from './product-model.js';

class ProductService {
    // Define the createProduct function to create a new product in the database
    async createProduct(product) {
        // Create a new product instance with the provided product object
        const newProduct = new Product(product);
        // Save the new product to the database
        await newProduct.save();
        // Return the new product instance
        return newProduct;
    }

    // Define the getAllProducts function to retrieve all products from the database
    async getAllProducts() {
        // Use the find method to retrieve all products from the database
        const products = await Product.find({});
        // Return the array of products
        return products;
    }

    // Define the getProductById function to retrieve a single product by ID from the database
    async getProductById(id) {
        // Use the findById method to retrieve a product by ID from the database
        const product = await Product.findById(id);
        // Return the product instance
        return product;
    }

    // Define the updateProductById function to update a single product by ID in the database
    async updateProductById(id, updatedProduct) {
        // Define the options object with the new and runValidators properties
        const options = { new: true, runValidators: true };
        // Use the findOneAndUpdate method to update a product by ID in the database with the updatedProduct object and options
        const product = await Product.findOneAndUpdate({ _id: id }, updatedProduct, options);
        // If the product instance is not found, throw an error
        if (!product) {
            throw new Error('Product not found');
        }
        // Return the updated product instance
        return product;
    }

    // Define the deleteProductById function to delete a single product by ID from the database
    async deleteProductById(id) {
        // Use the findOneAndDelete method to delete a product by ID from the database
        const product = await Product.findOneAndDelete({ _id: id });
        // If the product instance is not found, throw an error
        if (!product) {
            throw new Error('Product not found');
        }
    }
}

export default new ProductService();
