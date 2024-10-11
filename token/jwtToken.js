import jwt from "jsonwebtoken";

/**
 * Funtion for generating token for Authentication
 * 
 * 
 * @param {Object} user -Parameter of object to get username and password
 * @param {String} user.name -parameter for holding userName
 * @param {String} user.password -parameter for holding userPassword
 * 
 * @returns {String} -JWT token
 */

const generateToken = (user) =>{
    try{
        const token = jwt.sign(user,process.env.TOKEN_SCRETE)
        return token
    }catch(error){
        return console.log(error)
    }
}

export default generateToken