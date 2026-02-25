import Plan from "../../../schemas/Plan.js";

async function update(req, res, next) {
    try {
        const { update, id: _id } = req.body;
        const response = await Plan.updateOne(
            { _id },
            {
                ...update,
            }
        );
        res.json({
            success: response.acknowledged,
            message: response.modifiedCount ? "Plan Updated" : "Plan Unchanged",
        });
    } catch (err) {
        next(err);
    }
}

export default update;
