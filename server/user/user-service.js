// Import the axios and axios-retry modules
import axios from 'axios';
import axiosRetry from 'axios-retry';

// Import the logger module from the logs configuration file
import { logger } from '../../config/logs.js';

// Enable retrying failed requests up to 3 times with exponential backoff delay
axiosRetry(axios, {
retries: 3,
retryDelay: axiosRetry.exponentialDelay
});

// Define the fetchIdInfo function to fetch information about an ID number
export async function fetchIdInfo(idNumber) {
try {
// Send a GET request to the IP-address endpoint with the provided ID number
const response = await axios.get(`IP-address/${idNumber}`);
if (response.data?.success) {
// If the response is successful, extract the first name and last name from the responseBody object
const { first_name: firstName, last_name: lastName } = response.data?.responseBody || {};
// Log a success message and return an object with the extracted first name and last name
logger.info(`${idNumber} has been successfully validated`);
return { success: true, firstName, lastName };
} else {
// If the response is unsuccessful, log an error message and return an object with the error message
logger.error(`${idNumber} validation failed: ${response.data?.message}`);
return { success: false, message: response.data?.message || "Unknown error" };
}
} catch (error) {
// If an error occurs during the request, log the error and throw a new error with a message
logger.error(error);
throw new Error('Failed to fetch idNumber information');
}
}

// Define the PaymentGateWay function to process payments through the preferred payment gateway
export async function PaymentGateWay(param) {
try {
// Send a GET request to the payment gateway endpoint with the provided parameters
const payload = await axios.get(`https://domain_name/pay`, param);

} catch (error) {
// If an error occurs during the request, handle the error appropriately
}
}