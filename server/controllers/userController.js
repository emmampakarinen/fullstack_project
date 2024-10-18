const User = require('../models/User');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// using JWT passport for authentication
var JwtStrategy = require('passport-jwt').Strategy // http://www.passportjs.org/packages/passport-jwt/
var ExtractJwt = require('passport-jwt').ExtractJwt
const passport = require('passport')
const secretKey = process.env.SECRET || 'secret'

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = secretKey


passport.use(new JwtStrategy(opts, function(jwt_payload, done) { 
  console.log("JWT payload received", jwt_payload)
  User.findOne({ email: jwt_payload.email }) // extracting JWT payload from request and looking up the user from database
      .then(user => done(null, user))
      .catch(err => done(err, false))
})) // initializing the passport settings to be used in the jwtStrategy with the token 

/* express-validator for checking sufficient passwords and correct e-mails */

// 'body' is for validating and sanitizing body parameters from requests
// 'validationResult' is a function that gives the result of the validation (errors) 
var {body, validationResult} = require('express-validator'); 
const registerValidator = [ // reference: https://medium.com/@hcach90/using-express-validator-for-data-validation-in-nodejs-6946afd9d67e 
  body('firstname', 'Firstname is empty').not().isEmpty(),
  body('lastname', 'Lastname is empty').not().isEmpty(),
  body('email', 'E-mail was not provided in e-mail format').isEmail(),
  body('password', 'Password is empty').not().isEmpty(),
  body('password', 'Password is not strong enough').isStrongPassword({ // Setting up requirements for the password when registrating. Reference: https://express-validator.github.io/docs/api/validation-chain/ 
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
] 

exports.registerValidator = registerValidator

exports.loginUser = async (req, res, next) => {
    let pswd = req.body.password

    User.findOne({ email: req.body.email }).then((user) => { // checking if provided e-mail is found from database
        if (!user) { // if user not found
            return res.status(403).json({ "msg": "Invalid credentials" }) // responding with forbidden code
        } else {
            bcrypt.compare(pswd, user.password).then((resp) => { // if user is found, comparing the provided password to one from the database
                if (resp === true) {
                    var token = jwt.sign({ email: req.body.email }, "secret") // Creating token and including email in it
                    return res.status(200).json({ "success": true, "token": token, "userid": user._id }) // responding with token and user id to be saved in local storage
                } else {
                    return res.status(403).json({ "msg": "Invalid credentials" }) // if password was incorrect
                }
            })
        }
    })
};

exports.registerUser = async (req, res) => {
    const result = validationResult(req) // checking first whether the username, e-mail and password given pass the requirements
    console.log(result)

    if (!result.isEmpty()) { // If the e-mail, username and/or password are insufficient, error is given. Reference: https://express-validator.github.io/docs/guides/getting-started
        return res.status(400).send({ errors: result.array() })
    }
    
    // Continuing user registration after passing register elements -check
    let pswd = req.body.password

    User.findOne({ email: req.body.email }).then(async (email) => { // checking if a user with same e-mail as provided already exists
        
        if (!email) { // if not found, continuing with creating new user
        var salt = bcrypt.genSaltSync(10) // Hashing the password with bcrypt. Reference https://www.npmjs.com/package/bcryptjs
        var hash = bcrypt.hashSync(pswd, salt) 

        // Creating new user to database
        const new_user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email, 
            password: hash,
            profileText: "",
            registerDate: new Date().getTime(),
            image: null
        })
        
        new_user.save()
        .then(() => {
            console.log("User registered")
            return res.status(200).send({ "success": true, "message": "registration complete" })
        })

        } else { // if user with same e-mail already exists
            return res.status(403).json({ "msg": "Email already in use" })
        }
    })
}