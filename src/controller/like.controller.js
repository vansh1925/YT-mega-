import { Like } from "../models/like.models"
import { Video } from "../models/video.models"
import { ApiError } from "../utils/ApiErrors"
import { ApiResponse } from "../utils/ApiResponse"
import asyncHandler from "express-async-handler"
import { Tweet } from "../models/tweet.models"
import { Comment } from "../models/comment.models"
import mongoose from "mongoose"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    // Check if video exists
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiErrorError(400, "Video not found")
    }
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(400, "User not registered")
    }
    const existingLike = await Like.findOne({
        $and: [
            { video: videoId },
            { likedBy: userId }
        ]
    })//here no need o use alnd as if main seedha ,findOne({video: videoId,likedBy: userId}) bhi likhta to shi hota as vo by default unhe and hi maanta hai 
    if (existingLike) {
        await Like.deleteOne({
            video: videoId,
            likedBy: userId
        })
        return new ApiResponse(200, 'false', "Like removed")
    }
    else {
        await Like.create({
            $and: {
                video: videoId,
                likedBy: userId
            }
        })
        return new ApiResponse(200, 'true', "Like removed")
    }


})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    if (!commentId) {
        throw new ApiError(400, "Comment not found")
    }
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(400, "User not registered")
    }
    const existingLike = await Comment.findOne({ comment: commentId, likedBy: userId })
    if (existingLike) {
        await Comment.deleteOne({ comment: commentId, likedBy: userId })
        return new ApiResponse(200, 'false', "Like removed")
    }
    else {
        await Comment.create({
            $and: {
                comment: commentId,
                likedBy: userId
            }
        })
        return new ApiResponse(200, 'true', "Like added")
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params
    if (!tweetId) {
        throw new ApiError(400, "Tweet not found")
    }
    const userId = req.user._id
    if (!userId) {
        throw new ApiError(400, "User not registered")
    }
    const existingLike = await Tweet.findOne({ tweet: tweetId, likedBy: userId })
    if (existingLike) {
        await Tweet.deleteOne({ tweet: tweetId, likedBy: userId })
        return new ApiResponse(200, 'false', "Like removed")
    }
    else {
        await Tweet.create({
            $and: {
                tweet: tweetId,
                likedBy: userId
            }
        })
        return new ApiResponse(200, 'true', "Like added")
    }

})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos = Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        fullName: 1,
                                        profileImage: 1
                                    }
                                }
                            ]
                        }
                    },

                    {
                        $addFields: {
                            owner: { $first: "$owner" }  // flatten owner array to single object
                        }
                    }

                ]

            }
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
            }
        }
    ])
    if (!likedVideos?.length) {
        return res.status(404).json(new ApiResponse(404, null, "User has no liked videos"));
    }

    return res.status(200).json(
        new ApiResponse(200, likedVideos.map(like => like.video[0]), "Your liked videos are here")
        //i used this likeVideos[0].videos which is wrong as it will give me the first video of the liked videos
        //but i need to get all the liked videos so i used likedVideos.map(like => like.video[0])
        /*o/p of likedVideos
        [
            {
                _id: 'like1',
                video: [ { _id: 'vid1', title: 'Video 1' } ],
                likedBy: 'userId'
            },
            {
                _id: 'like2',
                video: [ { _id: 'vid2', title: 'Video 2' } ],
                likedBy: 'userId'
            }
        ]
        by my way we ll get video: [ { _id: 'vid1', title: 'Video 1' } ] this but by map we ll get 
        [
            { _id: 'videoId1', title: 'Learn MERN Stack' },
            { _id: 'videoId2', title: 'Advanced MongoDB' }
        ]
        */

    );
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}