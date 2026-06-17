// index.js
const crypto = require('./build/Release/crypto.node');

module.exports = {
    hashPassword: crypto.hashPassword,
    validatePassword: crypto.validatePassword,
    generateToken: crypto.generateToken
};