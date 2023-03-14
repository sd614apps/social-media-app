import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })
        await newPost.save();

        const updatedPosts = await Post.find();

        res.status(201).json(updatedPosts);

    } catch (err) {
        res.status(409).json({ ERROR: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const feedPosts = await Post.find();

        res.status(200).json(feedPosts);

    } catch (err) {
        res.status(404).json({ ERROR: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const userPosts = await Post.find({ userId });

        res.status(200).json(userPosts);

    } catch (err) {
        res.status(404).json({ ERROR: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const likedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(likedPost);

    } catch (err) {
        res.status(404).json({ ERROR: err.message });
    }
};
