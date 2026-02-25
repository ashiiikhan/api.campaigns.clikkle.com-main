import sesClient from './../libs/sesClient.js';
import { SendEmailCommand } from '@aws-sdk/client-ses';
import Notification from '../schemas/Notification.js';

function flattern(datas, key, value) {
	const flattered = {};
	for (const data of datas) {
		flattered[data[key]] = data[value];
	}

	return flattered;
}

async function sendMail(emails, subject, content, from = 'test@clikkle.com') {
	console.log({ emails, subject, content, from });
	const command = new SendEmailCommand({
		Destination: {
			ToAddresses: Array.isArray(emails) ? emails : [emails],
		},
		Message: {
			Subject: {
				Charset: 'utf-8',
				Data: subject,
			},
			Body: {
				Text: {
					Charset: 'utf-8',
					Data: content,
				},
			},
		},
		Source: from,
		ReplyToAddresses: [from],
		ConfigurationSetName: 'Notifications',
	});

	const response = await sesClient.send(command);
	console.log(response);
}

function pushNotification(args) {
	return new Notification(args).save();
}

const isDefined = (...a) => a.every((a) => typeof a !== 'undefined');
const isUndefined = (...a) => a.every((a) => typeof a === 'undefined');

export { flattern, sendMail, pushNotification, isDefined, isUndefined };
