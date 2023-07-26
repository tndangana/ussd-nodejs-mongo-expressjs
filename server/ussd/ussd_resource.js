import { fetchIdInfo, PaymentGateWay } from "../user/user-service.js";
import productService from "../products/product-service.js";
import NodeCache from 'node-cache';


// Create a new USSD service

const cache = new NodeCache();
export const userPayment = async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;

    let response;
    let length = text.split('*').length;
    let txt = text.split('*');

    if (!txt[0]) {
        response = `CON Welcome to African Big Nerd Platform.\n Please enter  identification number#:`;
        return res.send(response);
    }
    // User entered id number number txt[0]
    else if (txt[0] && length === 1) {
        const iDInfo = await fetchIdInfo(txt[0]);
        if (!iDInfo?.success) {
            cache.del(sessionId);
            // If the registration number is invalid, send an error response and end the session
            response = `END Invalid identification number. Please enter a valid identification number:`;
            res.send(response);
            return;
        }

        // Store the session data in a single object
        const sessionData = {
            iDInfo,
            selectedProductIndices: [],
            currentPage: 1, // Add this property to keep track of the current product page
            // Add other properties as needed
        };

        cache.set(sessionId, sessionData);

        const productsPerPage = 10;
        const startIndex = (sessionData.currentPage - 1) * productsPerPage; // Use sessionData.currentPage to get the current page number
        const endIndex = startIndex + productsPerPage;
        const products = await productService.getAllProducts();
        const pageProducts = products.slice(startIndex, endIndex);
        const fullName = `${iDInfo.firstName} ${iDInfo.lastName}`;
        const productPrompt = `CON Welcome ${fullName}. Please select the products you want to pay for (page ${sessionData.currentPage}): \n${pageProducts
            .map((product, index) => `${startIndex + index + 1}. ${product.name} (ZWL ${product.price})`)
            .join('\n')}\n\nEnter the product numbers you want to buy (e.g. 1,2,3):\n\nEnter 0 to go to the next page:`;

        // Send the prompt to the user
        res.send(productPrompt);
        return;
    }

    //User enters next page directly through typeing 0;
    else if (txt[1] === '0' && length === 2) {
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.iDInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }
        // If the user wants to go to the next page, increment the currentPage property and send the next product prompt
        const productsPerPage = 10;
        cachedData.currentPage += 1;
        cache.set(sessionId, cachedData);
        const currentPage = cachedData.currentPage;
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const products = await productService.getAllProducts();
        const pageProducts = products.slice(startIndex, endIndex);
        const productPrompt = `CON Please select the products you want to pay for (page ${currentPage}): \n${pageProducts
            .map((product, index) => `${startIndex + index + 1}. ${product.name} (ZWL ${product.price})`)
            .join('\n')}\n\nEnter the product numbers you want to buy (e.g. 1,2,3):\n\nEnter 0 to go to the next page:`;

        res.send(productPrompt);
        return;
    }

    //This is when a user selects next form. And selects products from page 2
    else if (txt[1] === '0' && txt[2] && length === 3) {
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.iDInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }

        const productsPerPage = 10;
        const startIndex = (cachedData.currentPage - 1) * productsPerPage; // Use cachedData.currentPage to get the current page number
        const endIndex = startIndex + productsPerPage;
        const productList = await productService.getAllProducts();
        const pageProducts = productList.slice(startIndex, endIndex);

        const selectedProductIndices = txt[2]
            .split(',')
            .map((number) => parseInt(number.trim(), 10) - 1)
            .filter((index) => index >= 0 && index < endIndex);

        // Update the selectedProductIndices property of the session data object
        cachedData.selectedProductIndices = selectedProductIndices;
        cache.set(sessionId, cachedData);

        // Retrieve the selected products
        const selectedProductIndices1 = cachedData.selectedProductIndices;
        const products = await productService.getAllProducts();
        const selectedProducts = selectedProductIndices1.map((index) => products[index]);

        // Generate the prompt for confirming the purchase
        const totalPrice = selectedProducts.reduce((total, product) => total + product.price, 0);
        const productPrompt = `CON You have selected the following products:\n${selectedProducts
            .map((product) => `${product.name} (ZWL ${product.price})`)
            .join("\n")}\n\nTotal price: ZWL ${totalPrice}\n\nEnter 1 to confirm payment or 2 to cancel:`;

        // Send the prompt to the user
        res.send(productPrompt);
        return;
    }

    else if (txt[1] && txt[1] !== '0' && length === 2) {
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.registrationInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }

        const productsPerPage = 10;
        const startIndex = (cachedData.currentPage - 1) * productsPerPage; // Use cachedData.currentPage to get the current page number
        const endIndex = startIndex + productsPerPage;
        const productList = await productService.getAllProducts();
        const pageProducts = productList.slice(startIndex, endIndex);

        const selectedProductIndices = txt[1]
            .split(',')
            .map((number) => parseInt(number.trim(), 10) - 1)
            .filter((index) => index >= 0 && index < endIndex);

        // Update the selectedProductIndices property of the session data object
        cachedData.selectedProductIndices = selectedProductIndices;
        cache.set(sessionId, cachedData);

        // Retrieve the selected products
        const selectedProductIndices1 = cachedData.selectedProductIndices;
        const products = await productService.getAllProducts();
        const selectedProducts = selectedProductIndices1.map((index) => products[index]);

        // Generate the prompt for confirming the purchase
        const totalPrice = selectedProducts.reduce((total, product) => total + product.price, 0);
        const productPrompt = `CON You have selected the following products:\n${selectedProducts
            .map((product) => `${product.name} (ZWL ${product.price})`)
            .join("\n")}\n\nTotal price: ZWL ${totalPrice}\n\nEnter 1 to confirm payment or 2 to cancel:`;

        // Send the prompt to the user
        res.send(productPrompt);
        return;

    } 
    // confirm payment when its first page
     else if(txt[2] === '1' && length === 3){
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.registrationInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }
        const selectedProductIndices = cachedData.selectedProductIndices;
        const products = await productService.getAllProducts();
        const selectedProducts = selectedProductIndices.map((index) => products[index]);
        // await processPayment(selectedProducts);
        // TODO: PAYMENT SHOULD BE PUT HERE
        response = `END Payment successful. Thank you for your purchase.`;
        cache.del(sessionId);
        res.send(response);
        return;
     }

     else if(txt[2] === '2' && length === 3){
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.registrationInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }
        response = `END Payment cancelled. Thank you for considering our products.`;
        cache.del(sessionId);
        res.send(response);
        return;
     }

      // confirm payment when its first page
      else if(txt[3] === '1' && length === 4){
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.registrationInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }
        const selectedProductIndices = cachedData.selectedProductIndices;
        const products = await productService.getAllProducts();
        const selectedProducts = selectedProductIndices.map((index) => products[index]);
        // await processPayment(selectedProducts);
        // TODO: Should put payment
        response = `END Payment successful. Thank you for your purchase.`;
        cache.del(sessionId);
        res.send(response);
        return;
     }

     else if(txt[3] === '2' && length === 4){
        const cachedData = await cache.get(sessionId);
        if (!cachedData?.iDInfo) {
            // If the session data is not found, send an error response and end the session
            response = `END Session data not found. Please start a new session.`;
            res.send(response);
            return;
        }
        response = `END Payment cancelled. Thank you for considering our products.`;
        cache.del(sessionId);
        res.send(response);
        return;
     }else {

     }
    

};