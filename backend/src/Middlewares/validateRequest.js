import jwt from "jsonwebtoken";
import ApiResponse from "../utility/ApiResponse.js";
import pool from "../Config/DBConfig.js";

const protect = async (req, res, next) => {
  let token =req.cookies.token;

  if ( !token) {
    return res
        .status(400)
        .json(
          new ApiResponse(400, "error", "JWT token is missing", null),
        );
  }
    try{

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await pool.query("SELECT * FROM users WHERE id=$1",[decoded.id]);

      if (!req.user) {
        return res
          .status(404)
          .json(
            new ApiResponse(
              404,
              "error",
              "User not found with this token",
              null,
            ),
          );
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "error", "Not authorized, token failed", null),
        );
    }
  }


export default protect;
