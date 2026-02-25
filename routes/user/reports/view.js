// import Report from '../../../schemas/Report.js';

async function view(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { id: campaignId } = req.params;

        // const report = await Report.findOne({ campaignId, userId });
        res.json({
            success: 1,
            // data: report,
        });
    } catch (err) {
        next(err);
    }
}

export default view;
