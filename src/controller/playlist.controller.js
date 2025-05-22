import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
    })
    await playlist.populate("videos", "title thumbnail")
    if (!playlist) {
        throw new ApiError(500, "Playlist not created")
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist created successfully"))


})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }
    try {
        const playlists = await Playlist.find({ owner: userId })
            .populate("videos", "title thumbnail")
            .sort({ createdAt: -1 })
        if (!playlists.length) {
            throw new ApiError(404, "No playlists found")
        }
        return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"))
    } catch (error) {
        throw new ApiError(500, `error in fetching playlists:-${error.message}`)
    }

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
        .populate("videos", "title thumbnail")
        .populate("owner", "username fullName avatar")
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found")
    }
    //yahan it is necessary to check ki video exist krti hai ya ni
    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already exists in playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    await playlist.populate("videos", "title thumbnail")
    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    const video = await Video.findById(videoId)
    if (!video) {
        throw new ApiError(400, "Video not found")
    }
    // Convert both to strings for comparison
    // since videos is an array of objectids tand jo params vala hai vo string hoga so we cant compare directly aur 
    //maine is pehale deleteOne use kiya tha vo pure doc ko delete krta hai na ki d=single fields or entries
    if (!playlist.videos.map(id => id.toString()).includes(videoId)) {//playlist.videos.some(id => id.toString() === videoId) more better as map se new arr banti hai
        throw new ApiError(400, "Video not found in playlist")
    }

    // Remove videoId from the array
    //now if match kr gya to filter use kiya ki if equal nhi to to theek rkhlo varna delete kr do
    playlist.videos = playlist.videos.filter(
        id => id.toString() !== videoId
    )

    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist")
    )



})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Invalid playlist id")
    }
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    await Playlist.deleteOne({ _id: playlistId })
    return res.status(200).json(new ApiResponse(200, null, "Playlist deleted successfully"))


})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }
    if (!name || !description) {
        throw new ApiError(400, "Name and description are required")
    }
    playlist.name = name
    playlist.description = description
    await playlist.save()
    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist updated successfully")
    );

})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
