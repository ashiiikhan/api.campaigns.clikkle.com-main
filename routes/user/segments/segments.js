import mongoose from "mongoose";
import DataSource from "../../../classes/DataSource.js";
import Segment from "../../../schemas/Segment.js";

async function allSegments(req, res, next) {
    try {
        const userId = mongoose.Types.ObjectId(req.user.id);
        const dataSource = new DataSource(Segment, req.query);

        const segments = await dataSource.find({
            userId,
        });

        res.json({
            success: 1,
            segments: segments,
            pageData: dataSource.pageData,
        });
    } catch (err) {
        next(err);
    }
}

export default allSegments;
