import {User} from '../Models/models.js'
import {sendEmail} from '../utilities/sendEmail.js'
import { ErrorResponse } from '../utilities/error.js'
import {Op} from 'sequelize'
import {asyncHandler} from '../Middleware/async.js'
import jwt from 'jsonwebtoken';


//register user
//route 
//


const register = async (req, res, next) => { 
    try {
        const { fullName, email, password, year, group, role } = req.body;

        // Create user
        const user = await User.create({
            fullName, 
            email, 
            password,
            year,
            group,
            role
        });
        res.json({
            success: true,
            message: 'User registered successfully',
            user: {
                userId: user.userId,
                fullName: user.fullName,
                email: user.email,
                year: user.year,
                group: user.group,
                role: user.role
            }
        });

        // const random = await user.assignRandomReviewer();
        // console.log(random)

        // if(random %2==0) { //
        //     await User.update({ role: 'judge' }, { where: { id: user.id } });
        //     console.log(user.role)
        // }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err)
    }
};

//login user
//route 
//

const login = async (req, res, next) => { 
    try {
    const { email, password } = req.body;

    // Validation
    if(!email || !password) {
        return next(new ErrorResponse('Please provide an email and a password', 400));
    }

    // Check for user
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
        const isMatched = (password === user.password);
        
    if(!isMatched){
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err)
    }
};

//get the user currently logged in 
//route 
//
// const getMe = async (req, res, next) => { 
//     try {
//         const user = await User.findByPk(req.user.userId);

//         if (!user) {
//             return next(new ErrorResponse('User not found', 404));
//         }

       

//         res.status(200).json({
//             success: true,
//             data: user
//         });       
//     } catch (err) {
//         next(err);
//     }
// };
const getMe = async (req, res, next) => {
    // req.user should be set in the authentication middleware
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }
  
    // Fetch the user's data
    const user = await User.findByPk(req.user.userId);
  
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    console.log(user);
  
    res.json({ success: true, data: user });

  };


//log out 
//
//




//Update user details 
const updateDetails = asyncHandler( async (req, res, next) => { 
    const fieldsToUpdate = {
        fullname: req.body.fullname,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true, 
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});



const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
  
    // Options for the cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    // Secure cookie in production
    if (process.env.NODE_ENV === 'production') {
      options.secure = true;
    }
  
    // Set cookie and send response
    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        token,
        user: {
          userId: user.userId,
          fullName: user.fullName,
          email: user.email,
          year: user.year,
          group: user.group,
          role: user.role,
        },
      });
  };



export {register , login , getMe , updateDetails};


