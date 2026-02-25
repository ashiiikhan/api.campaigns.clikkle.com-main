import SignUpForm from "../../../schemas/SignUpForm.js";

async function view(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { id: formId } = req.params;

        const form = await SignUpForm.find({ userId, _id: formId });
        res.json({
            success: 1,
            form,
        });
    } catch (err) {
        next(err);
    }
}

export default view;
