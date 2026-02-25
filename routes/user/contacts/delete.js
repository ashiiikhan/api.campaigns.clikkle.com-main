import Contact from '../../../schemas/Contact.js';
import Tag from '../../../schemas/Tag.js';
import { pushNotification } from '../../../utilities/functions.js';

async function deleteContacts(req, res, next) {
    try {
        const { id: userId } = req.user;
        const { ids = [] } = req.body;
        const contactFilter = { userId, _id: { $in: ids } };
        const tags = {};

        const contacts = await Contact.find(contactFilter);
        contacts.forEach((contact) => {
            contact.tags.forEach((tag) => {
                tags[tag] = (tags[tag] || 0) + 1;
            });
        });

        const tagData = {};

        for (const tag in tags) {
            let count = tagData[tags[tag]];
            console.log(count);
            if (Array.isArray(count)) {
                count.push(tag);
            } else {
                tagData[tags[tag]] = [tag];
            }
        }

        for (const count in tagData) {
            await Tag.updateMany(
                { userId, _id: { $in: tagData[count] } },
                { $inc: { contacts: -parseInt(count) } }
            );
        }

        // await pushNotification({
        //     userId,
        //     type: "contact",
        //     title: "Contact deleted",
        //     description: `A contact ${contact.name} has been deleted`,
        // });

        const deleted = await Contact.deleteMany(contactFilter);
        res.json({
            success: deleted.acknowledged,
            deleteCount: deleted.deletedCount,
        });
    } catch (err) {
        next(err);
    }
}

export default deleteContacts;
