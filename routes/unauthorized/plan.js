import Plan from "../../schemas/Plan.js";

async function getAllPlans(req, res, next) {
    try {
        const plans = await Plan.find();
        const contactsIndex = [
            "500",
            "1,000",
            "2,500",
            "5,000",
            "10,000",
            "25,000",
            "50,000",
            "75,000",
            "100,000",
            ">100,000",
        ];
        res.json({
            success: 1,
            data: plans,
            index: contactsIndex,
        });
    } catch (err) {
        next(err);
    }
}

export default getAllPlans;
