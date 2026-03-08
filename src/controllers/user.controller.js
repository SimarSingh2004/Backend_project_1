import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { UploadOnCloudinary } from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  )
    throw new ApiError(400, "All fields are required");

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) throw new ApiError(409, "User already existes");

  //req.files is an object containing the uploaded files, where the keys are the field names specified in the multer middleware and the values are arrays of file objects. So, to access the path of the uploaded avatar and coverImage, we use req.files?.avatar[0]?.path and req.files?.coverImage[0]?.path respectively.
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath = null;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  const avatarUrl = await UploadOnCloudinary(avatarLocalPath);
  const coverImageUrl = await UploadOnCloudinary(coverImageLocalPath);

  if (!avatarUrl) throw new ApiError(500, "Error uploading avatar");

  const user = await User.create({
    fullname,
    avatar: avatarUrl.url,
    coverImage: coverImageUrl?.url || "",
    username,
    email,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };
