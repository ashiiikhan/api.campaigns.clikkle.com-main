import Template from "../../../schemas/Template.js";

async function deleteTemplates(req, res, next) {
    const { ids } = req.body;
    try {
        const deleted = await Template.deleteMany({ _id: { $in: ids } });
        res.json({
            success: deleted.acknowledged,
            message: `${deleted.deletedCount} campaign(s) deleted`,
        });
    } catch (err) {
        next(err);
    }
}

export default deleteTemplates;
