import User from '../../schemas/User.js';
import { sendMail } from '../../utilities/functions.js';
import crypto from 'crypto';

async function createAccount(req, res, next) {
	try {
		const {
			username,
			firstName,
			email,
			prospects,
			employees,
			industry,
			password,
		} = req.body;
		const token = crypto.randomBytes(64).toString('hex');

		const user = new User({
			username,
			firstName,
			email,
			prospects,
			employees,
			industry,
			password,
			token,
		});

		await user.save();
		sendMail(
			user.email,
			'Verify your account',
			`Hey ${user.firstName}, you have registered on clikkle campaigns use the link to verify your account ${process.env.SERVER_URL}/verify/${token}`
		);

		res.json({
			success: 1,
			message: 'New User Created',
		});
	} catch (err) {
		next(err);
	}
}

export default createAccount;
