import mongoose from 'mongoose';
import Template from '../../../schemas/Template.js';
import { pushNotification } from '../../../utilities/functions.js';

const purchaseTemplate = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { templateId } = req.body;
        const template = await Template.findOne({ _id: templateId });
        template._id = mongoose.Types.ObjectId();
        template.userId = userId;
        template.isNew = true;
        await template.save();

        await pushNotification({
            userId,
            type: 'template',
            title: 'New template purchased',
            description: `A new template ${template.name} has been purchased`,
        });

        res.json({
            success: 1,
            template,
        });
    } catch (err) {
        next(err);
    }
};

export default purchaseTemplate;
