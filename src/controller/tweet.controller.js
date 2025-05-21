import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiErrors.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body
    const userId = req.user._id
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const tweet = await Tweet.create({
            content,
            owner: userId
        })

        return res.status(200).json(new ApiResponse(200, tweet, "Tweet created successfully"))
    } catch (error) {
        return new ApiError(500, error.message)

    }

})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params
    if (!userId) {
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const tweets = await Tweet.find({ owner: userId })
            .populate("owner", "username fullName avatar")
            .sort({ createdAt: -1 }); //latest tweets first
        //1: Hota ascending (purana pehle, naya baad mein).

        if (!tweets.length) {
            throw new ApiError(404, "No tweets found")
        }
        return res.status(200).json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
    } catch (error) {
        return new ApiError(500, error.message)

    }
})
const updateTweet = asyncHandler(async (req, res) => {
    const { content } = req.body;
    const tweetId = req.params.id;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID format");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to update this tweet");
    }

    tweet.content = content;
    await tweet.save();

    return res.status(200).json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    const tweetId = req.params.id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID format");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Not authorized to delete this tweet");
    }

    await tweet.deleteOne();

    return res.status(200).json(new ApiResponse(200, null, "Tweet deleted successfully"));
});


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}