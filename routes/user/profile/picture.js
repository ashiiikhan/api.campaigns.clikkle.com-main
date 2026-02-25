import User from "../../../schemas/User.js";
import fs from "fs";

async function picture(req, res, next) {
    try {
        const { id: userId } = req.user;

        const user = await User.findById(userId);
        const previousPicture = user.picture;
        const newImage = req.files.image[0].filename;
        const response = await user.update({
            picture: newImage,
        });

        res.json({
            success: response.acknowledged,
            newImage,
            message: response.acknowledged
                ? "Image uploaded successfully"
                : "Failed to upload image",
        });

        fs.unlink(`./uploads/${previousPicture}`, (err) => {
            if (err) return console.log(err);
            console.log(`${previousPicture} is deleted`);
        });
    } catch (err) {
        next(err);
    }
}

export default picture;
