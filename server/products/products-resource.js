// Import the ProducService module that contains functions to interact with the product data
import ProducService from "./product-service.js";

// Destructure the necessary functions from the ProducService module
const { createProduct, deleteProductById, getAllProducts, getProductById, updateProductById } = ProducService;


// Define the create function to create a new product
export const create = async (req, res, next) => {
  try {
    // Call the createProduct function with the request body to create the product
    const product = await createProduct(req.body);
    res.status(200).json(product);
  } catch (error) {
    // If an error occurs during the creation of the product, handle the error appropriately
    if (error.message.includes('already exists')) {
      res.status(409).json({ message: `${ req.body.name } already exists` });
  } else {
    next(error);
  }
}
};

// Define the findAll function to retrieve all products
export const findAll = async (req, res, next) => {
  try {
    // Call the getAllProducts function to retrieve all products
    const productList = await getAllProducts();
    res.status(200).json(productList);
  } catch (error) {
    // If an error occurs during the retrieval of the products, handle the error appropriately
    next(error);
  }
};

// Define the findOne function to retrieve a single product by ID
export const findOne = async (req, res, next) => {
  try {
    // Call the getProductById function with the product ID to retrieve the product
    const product = await getProductById(req.params.productId);
    res.status(200).json(product);
  } catch (error) {
    // If an error occurs during the retrieval of the product, handle the error appropriately
    next(error);
  }
};

// Define the update function to update a product by ID
export const update = async (req, res, next) => {
  try {
    // Call the updateProductById function with the product ID and request body to update the product
    const product = await updateProductById(req.params.productId, req.body);
    res.json(product);
  } catch (error) {
    // If an error occurs during the update of the product, handle the error appropriately
    next(error);
  }
};

// Define the deleteProduct function to delete a product by ID
export const deleteProduct = async (req, res, next) => {
  try {
    // Call the deleteProductById function with the product ID to delete the product
    const product = await deleteProductById(req.params.productId);
    res.json(product);
  } catch (error) {
    // If an error occurs during the deletion of the product, handle the error appropriately
    next(error);
  }
};