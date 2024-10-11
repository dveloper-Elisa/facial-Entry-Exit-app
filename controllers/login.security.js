import Security from "../model/securityModel.js";
import generateToken from "../token/jwtToken.js";
import bcrypt from "bcrypt";

/**
 * This is the function for security login
 *
 * @param {Request} req -getting User input
 * @param {Response} res -providing the reponse to the client
 * @returns {Promise<Response>} -return the promised for async function
 *
 */

const securityLogin = async (req, res) => {
  try {
    const { Sname, password } = req.body;

    const security = await Security.findOne({
      $or: [{ telephone: Sname }, { email: Sname }],
    });

    if (!security) {
      return res
        .status(404)
        .json({ status: "Failure", message: "Security not found" });
    }

    // Compare the provided password with the hashed password from the database
    const matchPassword = await bcrypt.compare(password, security.password);

    if (!matchPassword) {
      return res
        .status(403)
        .json({ status: "Failure", message: "Invalid credentials" });
    } else {
      // If password matches, generate a JWT token
      const generatedToken = { Sname, password };
      const token = generateToken(generatedToken);

      return res.status(200).json({
        status: "Success",
        message: "Login successful !!",
        token,
        security,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "Failure", message: "Error !! Internal server error" });
  }
};

export default securityLogin;
