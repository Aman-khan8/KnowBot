import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiResponse from "../utility/ApiResponse.js";
import pool from "../Config/DBConfig.js";
 
const signUp = async (req, res) => {
  try {

    const { name, email, password } = req.body;
    
    const alreadyExit = await pool.query("SELECT id from users WHERE email =$1",[email]);
    if (alreadyExit.rows.length > 0) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, "error", "Email is already registered", null),
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query ="INSERT INTO users(name,email,password_hash) VALUES($1,$2,$3) RETURNING *"
    const values=[name,email,hashedPassword]
    const result = await pool.query(query,values)
    
    const newUser = result.rows[0]

    // Strip password before sending
    
    delete newUser.password_hash;

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.cookie("token",token,{
      httpOnly:true,
    }).status(201).json(
      new ApiResponse(201, "success", "Signup Successful", {
        user: newUser,
      }),
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiResponse(500, "error", error.message, null));
  }
};

export default signUp;