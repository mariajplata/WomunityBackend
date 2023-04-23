/*
 * Middleware for protecting endpoint using JWT verify, 
 * Notices some endpoint doesn't require JWT Auth token.
 */
const jwt = require('jsonwebtoken');
const env = require('../config/database')

/**
 * Routing protection for endpoint using JWT verify
 * @param {*} req | headers['authorization']
 * @param {*} res | permission to consult endpoint 
 */
function verifyToken(req, res, next) {
    try {
        const token = req.headers["authorization"]; // Header
        
        if (token == null){
            throw new Error('Token no existe')
        }
        // Token verification
        jwt.verify(token, env.secret, (err, user) => {
            if (err) {
                console.log('Error', err);
                throw new Error('Token inválido')
            };
            
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error verifying token', error);
        res.status(400).json({success: false, msg: 'Wrong Token', error: error.message})
    }
    
}

module.exports = {
    verifyToken
}
