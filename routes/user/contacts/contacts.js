import mongoose from "mongoose";
import Contact from "../../../schemas/Contact.js";
import DataSource from "../../../classes/DataSource.js";

const contact = async (req, res, next) => {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id);
        const dataSource = new DataSource(Contact, req.query, [
            "subscribed",
            "source",
            "engagement",
        ]);

        const contacts = await dataSource.aggregate([
            {
                $match: {
                    userId,
                },
            },
            {
                $lookup: {
                    from: "tags",
                    localField: "tags",
                    foreignField: "_id",
                    as: "tags",
                    pipeline: [{ $limit: 3 }],
                },
            },
        ]);

        res.json({
            success: 1,
            contacts,
            pageData: dataSource.pageData,
        });
    } catch (err) {
        next(err);
    }
};

export default contact;
