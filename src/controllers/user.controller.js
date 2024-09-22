import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password, avatar } = req.body;

  if (
    [fullName, email, userName, password].some((field) => {
      !field || field?.trim() === "";
    })
  ) {
    throw new ApiError(400, "Please fill all required fields");
  }
});

export { registerUser };
