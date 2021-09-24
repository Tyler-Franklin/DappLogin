// Test For metamask web console:https://metamask.github.io/test-dapp/
// this must be in website console @ https://metamask.github.io/test-dapp/

// unlock Metamask and input,the fingerprint is come from backend@ /api/register
const userAddress = "0xB3c89EEa97E7b2F95691EACD80eB7AA24DC011D9"
var msgParams= {
    "domain": {
        "name": "Login User",
        "userAddress": "0xB3c89EEa97E7b2F95691EACD80eB7AA24DC011D9"
    },
    "message": {
        "contents": "Login to your account using Metamask",
        "fingerprint": "0xec9e6ebcec09445c0089a7d90996135f607746f79e3ced582713293f1be5b77b"
    },
    primaryType: 'RandomFingerprint',
    "types": {
        "RandomFingerprint": [
            {
                "name": "fingerprint",
                "type": "string"
            }
        ]
    }
}

var sign = await ethereum.request({
    method: 'eth_signTypedData_v4',
    params: [userAddress, JSON.stringify(msgParams)],
})

console.log(sign);

// user Metamask sign and put the sign in /api/islogin header['token']
// /api/islogin header['userAddress'] = 0xB3c89EEa97E7b2F95691EACD80eB7AA24DC011D9


// Other router module import and used
const isLogin = require("./auth.controller").isLogin;

if (isLogin) {
    res.send("JWT Token ERROR");
    return;
};

// Logic that only logged-in users can operate