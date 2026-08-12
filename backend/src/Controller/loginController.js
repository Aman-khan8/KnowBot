import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import ApiResponse from "../utility/ApiResponse.js";
import Pool from "../Config/DBConfig.js"

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Pool.query("SELECT id,password FROM users WHERE email=$1",[email]);
    if (user.rows.length ===0) {
      return res
        .status(400)
        .json(new ApiResponse(400, "error", "Email is not registered", null));
    }

    const isPassCorrect = await bcrypt.compare(password, user.rows[0].password);
    if (!isPassCorrect) {
      return res
        .status(400)
        .json(new ApiResponse(400, "error", "Invalid Credentials", null));
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    const loggedInUser = user.rows[0];
    delete loggedInUser.password;

    return res.cookie("token",token,{httpOnly:true,secure:false}).status(200).json(
      new ApiResponse(200, "success", "Login Successful", {
        user: loggedInUser,
      }),
    );
  } catch (err) {
    
    return res
      .status(500)
      .json(new ApiResponse(500, "error", err.message, null));
  }
};

export default login;
