import Security from "../model/securityModel.js";
import bcrypt from "bcrypt";

/**
 * Function for registering the Security person
 * @param {Request} req  -requesting data from body of the client
 * @param {Response} res  -sending response to client from server
 * @returns {Promise<Response>} -return the promise as asyc function
 */
const register = async (req, res) => {
  console.log(req)
  const { name, nid, telephone, email, password, role } = req.body;
  try {
    // creating hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const isSecurityExist = await Security.findOne({
      $or: [{ nid }, { telephone }],
    });
    if (isSecurityExist)
      return res.status(403).json({ message: "Security already exist" });

    const registerSecurity = await Security.create({
      name,
      nid,
      telephone,
      email,
      role,
      password: hashedPassword,
    });

    if (!registerSecurity) {
      return res.status(401).json({ message: "Security account not created" });
    }

    return res.status(200).json({
      message: "Security account created !!",
      insertedInfo: registerSecurity,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default register;
