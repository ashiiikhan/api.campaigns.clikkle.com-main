import mongoose from "mongoose";
import Contact from "../../../schemas/Contact.js";

async function view(req, res, next) {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id);
        const { id } = req.params;
        const [contact] = await Contact.aggregate([
            {
                $match: {
                    userId,
                    _id: mongoose.Types.ObjectId(id),
                },
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                },
            },
        ]);
        res.json({
            success: 1,
            contact,
        });
    } catch (err) {
        next(err);
    }
}

export default view;
