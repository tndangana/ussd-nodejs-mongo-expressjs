// Import the productRouter and paymentRouter modules
import productRouter from './products/index.js';
import paymentRouter from './ussd/index.js';

// Define the ussd function that takes in the express app object as a parameter
export const ussd = (app) => {
// Register the productRouter and paymentRouter middleware for the corresponding routes
app.use('/api/product', productRouter);
app.use('/api/ussd', paymentRouter);
};