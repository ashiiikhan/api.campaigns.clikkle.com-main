import SignUpForm from "../../../schemas/SignUpForm.js";

async function deleteForm(req, res, next) {
    try {
        const { id: userId } = req.user;
        let { ids } = req.body;

        if (typeof ids === "string") ids = [ids];

        const response = await SignUpForm.deleteMany({
            userId,
            _id: { $in: ids },
        });

        res.json({
            success: response.acknowledged,
            message: `${response.deletedCount} form(s) deleted`,
        });
    } catch (err) {
        next(err);
    }
}

export default deleteForm;
