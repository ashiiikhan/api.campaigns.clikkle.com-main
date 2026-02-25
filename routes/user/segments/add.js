import Segment from '../../../schemas/Segment.js';
import { pushNotification } from '../../../utilities/functions.js';

async function add(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { name, filters, type } = req.body;

        const segment = new Segment({
            name,
            filters,
            type,
            userId,
            dateCreated: new Date(),
        });
        await segment.save();

        await pushNotification({
            userId,
            type: 'segment',
            title: 'New segment added',
            description: `A new segment ${segment.name} has been added`,
        });

        res.json({
            success: 1,
            message: 'Segment saved successfully',
        });
    } catch (err) {
        next(err);
    }
}

export default add;
