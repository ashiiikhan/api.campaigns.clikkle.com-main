import Contact from '../../../schemas/Contact.js';
import Tag from '../../../schemas/Tag.js';
import { pushNotification } from '../../../utilities/functions.js';

const addContact = async (req, res, next) => {
    try {
        const { firstName, lastName, email, address, phone, birthday, tags } =
            req.body;
        const contact = new Contact({
            userId: req.user.id,
            subscribed: true,
            firstName,
            lastName,
            email,
            address,
            phone,
            birthday,
            tags,
            source: 'manual',
            rating: 0,
            dateSubscribed: new Date(),
            dateAdded: new Date(),
            lastChanged: new Date(),
        });

        if (!(await Tag.existsAll(tags))) {
            throw new Error('Tags does not exist');
        }

        await contact.save();

        await pushNotification({
            userId: req.user.id,
            type: 'contact',
            title: 'New contact added',
            description: `A new contact ${email} has been added to contacts`,
        });

        res.json({
            success: 1,
        });
    } catch (err) {
        next(err);
    }
};

export default addContact;
