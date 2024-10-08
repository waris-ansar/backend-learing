import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { emailSender } from "../utils/emailSender.js";
import { Verifaction } from "../models/verification.model.js";
import moment from "moment";
import { cookieOptions } from "../constants.js";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return new ApiError(500, "Failded to generate refresh or access token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;
  const verificationCode = Math.floor(Math.random() * 9999);
  if (
    [fullName, email, userName, password].some(
      (field) => !field || field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all required fields");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User alreday exist with given username or email");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files?.coverImage) &&
    req.files.coverImage?.length > 0
  ) {
    coverImageLocalPath = req.files?.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    email,
    fullName,
    avatar: avatar.url,
    coverImage: coverImage ? coverImage?.url : "",
    password,
  });

  await emailSender(user.email, "Verify your email", verificationCode);
  await Verifaction.create({
    userId: user._id,
    verificationCode,
    verificationCodeExpiry: moment().add(1, "hour").valueOf(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Internal server error");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  console.log(email, userName, password);

  if (!(email || userName)) {
    throw new ApiError(400, "Username or email is required!");
  }

  const user = await User.findOne({
    $or: [{ userName }, { password }],
  });

  if (!user) {
    throw new ApiError(409, "User not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { loggedInUser, accessToken, refreshToken },
        "User loggedin successfully"
      )
    );
});

const verifyUser = asyncHandler(async (req, res) => {
  const { email, verificationCode } = req.body;
  const user = await User.findOne({ email });

  const storedVerificationData = await Verifaction.findOne({
    userId: user._id,
  });

  if (!storedVerificationData) {
    throw new ApiError(404, "No Verification code is available for this user.");
  }

  if (verificationCode !== storedVerificationData.verificationCode) {
    throw new ApiError(401, "Invalid verification code!");
  }

  if (moment().isAfter(storedVerificationData.verificationCodeExpiry)) {
    throw new ApiError(401, "Code is expired!");
  }

  const verifiedUser = await User.findByIdAndUpdate(
    user._id,
    {
      isVerified: true,
    },
    { new: true }
  ).select("-password -refreshToken");

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { verifiedUser, accessToken, refreshToken },
        "User verified successfully"
      )
    );
});

export { registerUser, loginUser, verifyUser };
