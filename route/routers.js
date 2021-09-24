module.exports = function(app) {

    // Register login module
    const auth = require('../controller/auth.controller.js');
    app.get('/api/register', auth.register);             // unlock metamask and send GET to this URL req.query.userAddress
    app.get('/api/authenticate', auth.authenticate);     // Generate a random fingerprint and send it to Frontend
    app.get('/api/islogin', auth.isLogin);               // Use this judge before other routing controllers

}

