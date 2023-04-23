const User = require('../models/user_model');
const JWT = require('jsonwebtoken');
const BCRYPT = require('bcryptjs');
const CONFIG = require('../config/database');
const VALIDATOR = require('../utils/info_validator');


/**
 * Function to create user
 * @req | email and password
 * @returns | New user
 */
const createUser = async (req, res) => {
    try {
        let { email, password, nick, fullUserName } = req.body;
        if (!email || !password || !nick || !fullUserName) throw new Error('Some information is missing');
        if (!VALIDATOR.validateEmail(email) || !VALIDATOR.onCheckPassword(password)) throw new Error('Email or password are formatted incorrectly');

        email = email.toLowerCase();

        let checkExistingUser = await User.findOne({ email })
        if (checkExistingUser) throw new Error('User already exist');

        const hash = await BCRYPT.hash(password, 10);
        const user = { email, password: hash, nick, fullUserName };

        let userToCreate = new User(user); 
        await userToCreate.save();

        delete user.password;

        res.status(200).json({
            success: true,
            data: user,
            msg: 'User created successfully'
        })

    } catch (error) {
        console.error('Error creating user', error)
        res.status(400).json({
            success: false,
            error: error.message,
            msg: 'Something went wrong creating user'
        })
    }
}

/**
 * Login user
 * @param {*} req | email and password
 * @param {*} res 
 * @returns 
 */
const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) throw new Error('Email or password is missing');
        if (!VALIDATOR.validateEmail(email) || !VALIDATOR.onCheckPassword(password)) throw new Error('Email or password are formatted incorrectly');
    
        email = email.toLowerCase();
    
        let user = await User.findOne({ email }, {createdAt: 0, __v: 0});
        if (!user) {
            res.status(200).json({
                success: false,
                token: null,
                message: 'User does not exist.',
                user: null
            });
            return
        };
        // Compare passwords with bcrypt
        let checkPassword = await BCRYPT.compare(password, user.password);        
        if (!checkPassword) {
            res.status(200).json({
                success: true,
                token: null,
                message: 'Password given is incorrect.',
                user: null
            });
            return
        };
        
        user.password = undefined;

        // Note: In case user model gets to big, necessary to format a standard object to sign token 

        //Sign a token that expires in a week
        const token = JWT.sign({ user }, CONFIG.secret, { expiresIn: 604800 });

        res.status(200).json({
            success: true,
            token: token,
            user
        });
        
    } catch (error) {
        console.error('Error login user', error)
        res.status(400).json({
            success: false,
            error: error.message,
            msg: 'Something went wrong creating user'
        })
    }
}

module.exports = {
    createUser,
    login
}