import User from '../../schemas/User.js';
import { sendMail } from '../../utilities/functions.js';
import crypto from 'crypto';

export default async function (req, res, next) {
    const email = req.body.email;

    try {
        const token = crypto.randomBytes(64).toString('hex');

        const user = await User.findOne({ email });
        await user.updateOne({ $set: { token } });

        console.log({ user, token });

        sendMail(
            email,
            'Reset your password',
            `Hey ${user.firstName}, We have received a request to reset your Clikkle Campaigns password. use the link to reset your password ${process.env.DASHBOARD_URL}/create-password/${token}`
        );

        res.json({
            success: 1,
        });
    } catch (e) {
        next(e);
    }
}
