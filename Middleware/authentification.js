import jwt from 'jsonwebtoken'
import { ErrorResponse } from '../utilities/error.js'
import { User } from '../Models/models.js'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config({path : './cfg.env'});


const protect = async (req, res, next) => {
    try {
      const token = req.cookies.token;
      console.log(token);
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
      }
  
      // Verify and decode token
      const decoded = jwt.verify(token, process.env.JWT_KEY);
      console.log(decoded);
  
      // Fetch user
      const user = await User.findById(decoded.id);
      console.log(user);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Set req.user
      req.user = user;
  
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  };






  
const authorize = (...roles) => {
    return async (req, res, next) => {
      const user = await User.findOne({ where: { id: req.user.id } });
  
      if (!user || !roles.includes(user.role)) {
        return next(new ErrorResponse(`User role ${user ? user.role : 'unknown'} is unauthorized to access this route`, 403));
      }
  
      next();
    }
  };

  export {protect , authorize};