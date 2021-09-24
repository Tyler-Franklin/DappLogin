const db = require("../models");
const jwt = require('jsonwebtoken');
const JWTSecretKey = "YouAreBustMan4159"; // JWT slat
const web3 = require("web3");

var userMsgParams = new Array(); // User login fingerprint temporary dictionary, userMsgParams[userAddress] obtains the generated signature

// Generate random fingerprints By SHA256 Hash
function generateMsgParams(userAddress) {
    let result = {
    domain: {
        name: 'Login User',
        userAddress : userAddress
    },
    message: {
        contents: 'Login to your account using Metamask',
        fingerprint : web3.utils.sha3(userAddress + new Date() + Math.random()),
    },
    primaryType: 'RandomFingerprint',
    types: {
        RandomFingerprint: [{ name: 'fingerprint', type: 'string' }],
    },
    }
    userMsgParams[userAddress] = result; // update userMsgParams
    return result;
}

/*
When the user login first time, the frontend requests /api/register 
backend returns the fingerprint to the frontend, asks the frontend to sign and sends it back to/api/authenticate  
*/
exports.register = async(req, res) => {
    let userAddress = req.query.userAddress;
    generateMsgParams(userAddress);
    console.log(userMsgParams[userAddress]);    
    res.send(userMsgParams[userAddress]).status(200);

    // User address is written to the db and the user information table is created
    try {
        if (await db.userinfo.findByPk(req.query.userAddress)) {
        res.send("Address existing"); // user existing
        return;
        };

        db.userinfo.create({
            userAddress: req.query.userAddress,
        }).then(list => {
            console.log("Address Create Done");
            res.send(userMsgParams[userAddress]).status(200);
            return userMsgParams[userAddress];
        });
    } catch (err) {
        res.send("DB save Error").status(501);
    }
};

// User login and set JWT
exports.authenticate = async(req, res) => {
    console.log("/api/authenticate");
    console.log("userMsgParams[req.query.sign] : " + userMsgParams[req.query.userAddress]);
    let userAddress = req.query.userAddress;
    let recoverTypedSignature_v4 = require("eth-sig-util").recoverTypedSignature_v4;
    let toChecksumAddress = require("web3").utils.toChecksumAddress;
    if (!userMsgParams[userAddress]){
        res.send("User not register").status(502);
        return;
    }
    try {
        const recoveredAddr = recoverTypedSignature_v4({
            'data': userMsgParams[userAddress], // The fingerprint sent to the user
            'sig': req.query.sign,      // Data signed by the frontend with Metamask  
        });

        if (toChecksumAddress(recoveredAddr) === toChecksumAddress(userAddress)) {
            console.log("Success User : " + toChecksumAddress(recoveredAddr));
            let _token = jwt.sign({
                userAddress : toChecksumAddress(recoveredAddr),
                pwd : userMsgParams[recoveredAddr]
            }, JWTSecretKey, {
                expiresIn: 1000 * 3600 *24 * 365  // one year
            });
            res.send(_token)

        } else {
            console.log(`Failed to verify signer`);
            res.send(`Failed to verify signer`);
            return;
        };

    } catch (err) {
        console.error(err)
    }

};

// Verify the JWT
exports.isLogin = async(req, res) => {
    let _userAddress = req.get("userAddress");
    jwt.verify(req.headers.token, JWTSecretKey, (error, decoded) => {
        if(error) {
            console.log(error.message);
            return false;
        };

        if (decoded.userAddress == _userAddress) {
            res.send("JWT works good").status(200);
            return true;
        };
        res.send("JWT works False 1");
        return false;
    })

};



