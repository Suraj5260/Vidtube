import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary, deleteFromClodinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new ApiError(404, "User not found")
    }
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
  }
}

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body

  // validation
  if (
    [fullname, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists.")
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path
  const coverLocalPath = req.files?.coverImage?.[0]?.path

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing")
  }

  // const avatar = await uploadOnCloudinary(avatarLocalPath)
  // let coverImage = ""
  // if (coverLocalPath) {
  //   coverImage = await uploadOnCloudinary(coverLocalPath)
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath, "avatar")
    console.log("uploaded avatar", avatar);

  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new ApiError(500, "Failed to upload avatar")
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverLocalPath, "coverImage")
    console.log("uploaded coverImage", coverImage);

  } catch (error) {
    console.log("Error uploading coverImage", error);
    throw new ApiError(500, "Failed to upload coverImage")
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdUser, "User registered successfully"))
  } catch (error) {
    console.log('User creation failed');
    if (avatar) {
      await deleteFromClodinary(avatar.public_id)
    }
    if (coverImage) {
      await deleteFromClodinary(coverImage.public_id)
    }

    throw new ApiError(500, "Something went wrong while registering the user and Images were deleted")
  }

})

const loginUser = asyncHandler(async (req, res) => {
  // get data from body
  const { email, password } = req.body

  // validation
  if (!email || !password) {
    throw new ApiError(400, "All fields are required")
  }

  const user = await User.findOne({
    $or: [{ email }]
  })

  if (!user) {
    throw new ApiError(404, "User not found")
  }

  // validate password

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password!! ")
  }

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")

  if (!loggedInUser) {
    throw new ApiError(403, "User not logged In!! ")
  }

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User loggedin successfully"))

})

export {
  registerUser
}