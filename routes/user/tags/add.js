import Tag from '../../../schemas/Tag.js';
import { pushNotification } from '../../../utilities/functions.js';

async function addTag(req, res, next) {
    try {
        const { name } = req.body;
        const userId = req.user.id;

        const tag = new Tag({
            name: name.toLowerCase(),
            createdAt: new Date(),
            userId,
        });

        await tag.save();

        await pushNotification({
            userId,
            type: 'tag',
            title: 'New tag created',
            description: `A new tag ${tag.name} has been created`,
        });

        res.json({
            success: 1,
            message: 'New Tag Created',
        });
    } catch (err) {
        next(err);
    }
}

export default addTag;
