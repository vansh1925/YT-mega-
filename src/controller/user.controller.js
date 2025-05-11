import { asyncHandler } from "../utils/asyncHandler";
export const registerUser = asyncHandler(async (req, res) => {
    res.status(200), json({
        message: "ok"
    })
})//yahan return ki jarurat ni hai reason->