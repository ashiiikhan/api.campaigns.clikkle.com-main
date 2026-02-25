import Segment from "../../../schemas/Segment.js";

async function deleteSegment(req, res, next) {
    try {
        const { id: userId } = req.user;
        let { ids } = req.body;

        if (!Array.isArray(ids)) {
            ids = [ids];
        }

        const response = await Segment.deleteMany({
            _id: { $in: ids },
            userId,
        });

        res.json({
            success: response.acknowledged && response.deletedCount,
            message: `${response.deletedCount} Segment(s) deleted`,
        });
    } catch (err) {
        next(err);
    }
}

export default deleteSegment;
