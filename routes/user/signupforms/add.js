import SignUpForm from "../../../schemas/SignUpForm.js";

async function addSignUpForm(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { name, content } = req.body;

        const form = new SignUpForm({
            name,
            userId,
            dateCreated: new Date(),
            content,
        });

        await form.save();

        res.json({
            success: 1,
            message: `Form added successfully`,
        });
    } catch (err) {
        next(err);
    }
}

export default addSignUpForm;
