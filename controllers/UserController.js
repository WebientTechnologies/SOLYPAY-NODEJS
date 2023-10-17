const { catchError } = require("../middleware/CatchError");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../models/User");
const { sendToken } = require("../utils/sendToken");
const { emailUser } = require("../utils/emailUser");
const crypto = require("crypto");

exports.register = catchError(async (req, res, next) => {
  const { name, email, password } = req.body;
  // const file = req.file;

  if (!name || !email || !password)
    return next(new ErrorHandler("Please Enter All Fields", 400));

  let user = await User.findOne({ email });

  if (user) return next(new ErrorHandler("user already exist", 409));

  // upload files on cloud

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "tempId",
      url: "tempUrl",
    },
  });

  console.log(user)
  if(user) sendToken(res, user, "Registered SuccessFully ", 201);
});

exports.login = catchError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please Enter All Felids", 400));
  const user = await User.findOne({ email }).select("+password").exec();
  console.log({ user });
  if (!user)
    return next(
      new ErrorHandler("Please enter correct email or password", 401)
    );
  const isPassword = await user.checkPasswordMatch(password, user);
  if (!isPassword)
    return next(
      new ErrorHandler("Please enter correct email or password", 401)
    );

  sendToken(res, user, `welcome back ${user.name}`, 200);
});

exports.logout = catchError((req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      message: "logged out",
      success: true,
    });
});

exports.getMyProfile = catchError(async (req, res, next) => {
  const { user } = req.body;
  res.status(200).json({
    user,
    success: true,
  });
});

exports.changePassword = catchError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
  return next( new ErrorHandler("Please enter all fields", 400));
  }

  const { user } = req.body;
  let extractedUser = await User.findOne(user._id).select("+password").exec();
  let isMatch = extractedUser.checkPasswordMatch(oldPassword, extractedUser);

  if (!isMatch)
  return next( new ErrorHandler("Please enter correct Password", 401));

  extractedUser.password = newPassword;
  extractedUser.save();

  res.status(200).json({
    user: extractedUser,
    success: true,
    message: "Password changed successfully",
  });
});

exports.updateProfile = catchError(async (req, res, next) => {
  const { email, name } = req.body;
  const { user } = req.body;
  let extractedUser = await User.findById(user._id);
  if(email) extractedUser.email = email;
  if(name) extractedUser.name = name;

  extractedUser.save();

  res.status(200).json({
    user: extractedUser,
    success: true,
    message: "Profile updated successfully",
  });
});

exports.forgetPassword = catchError(async (req, res, next) => {
  const { email } = req.body;
  if(!email) 
  return next( new ErrorHandler("Please enter your email", 400));

  let user = await User.findOne({email});

  if(!user)res.status(400).json({
    success: false,
    message: "User not found",
  });


//   send token 
const resetToken =  await user.createResetToken(user);

const subject = 'Ease Learning forget password';
const resetUrl = `${process.env.FRONTEND_LINK}/resetpassword/${resetToken}`;
const message = `
Reset Your Password

Hello ${user.name},

You are receiving this email because you have requested to reset your password. Please click the link below to reset your password:

Reset Password: ${resetUrl}
This link will expires in next 15 minutes

If you did not request a password reset, you can ignore this email.

Thank you,
Your Ease Learning Team
`

console.log(message);

await emailUser(email , subject , message);

  res.status(200).json({
    success: true,
    message: `Token has been sent to your Mail ${email}`,
  });
});
exports.resetPassword = catchError(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;
  if(!password) res.status(400).json({
    success: false,
    message: "Please enter your password",
  });
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');


  let user = await User.findOne({resetPasswordToken:hashedToken , resetPasswordExpire :{
    $gt: Date.now()
  }});

  if(!user)res.status(400).json({
    success: false,
    message: "Invalid token or token has been expired",
  });


  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: `Your password has been changed`,
  });
});


