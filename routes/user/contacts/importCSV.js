import Contact from '../../../schemas/Contact.js';
import csv from 'csvtojson';
import fs from 'fs';
import mongoose from 'mongoose';
import chalk from 'chalk';

const removeFilters = ['null', 'undefined', '-', '_'];

async function importCSV(req, res, next) {
	const userId = mongoose.Types.ObjectId(req.user.id);
	const batchLength = 1000;
	const contactsBatch = [];
	const mapping = JSON.parse(req.body.mapping);
	const values = JSON.parse(req.body.values);
	values.userId = userId;
	values.source = 'imported';
	let success = 0;
	let total = 0;

	const file = req.files.csv_file[0].filename;
	console.log(req.files);
	const fileStream = fs.createReadStream(`./uploads/${file}`, 'utf-8');

	res.json({
		success: 1,
		message: 'Your contacts will be imported shortly',
	});

	csv()
		.fromStream(fileStream)
		.subscribe(
			async (contact) => {
				const newContact = {};
				for (const field in mapping) {
					const formalField = field;
					const actualField = mapping[field];
					if (removeFilters.includes(contact[actualField]?.toLowerCase())) {
						newContact[formalField] = '';
					} else {
						newContact[formalField] = contact[actualField];
					}
					contact[actualField] = undefined;
				}
				for (const field in values) {
					newContact[field] = values[field];
				}

				contactsBatch.push(newContact);
				if (contactsBatch.length === batchLength) {
					await saveContacts();
				}
			},
			() => { },
			() => {
				saveContacts(() => {
					console.log(`saved ${success}/${total}`);
				});
			}
		);

	async function saveContacts(cb) {
		total += contactsBatch.length;
		const contacts = [...contactsBatch];
		console.log(`trying to save ${contacts.length} contacts`);

		const filteredContacts = Array.from(
			new Set(contacts.map((doc) => doc.email))
		).map((email) => {
			return contacts.find((doc) => doc.email === email);
		});

		Contact.insertMany(filteredContacts, { ordered: false }, (err, data) => {
			if (err || !data) {
				console.log(chalk.red(err));
				if (typeof cb === 'function') cb();
				return;
			}

			success += data?.length;
			console.log(
				chalk.red(`failed ${filteredContacts.length - data?.length} contacts`)
			);
			console.log(chalk.green(`saved ${data?.length} contacts`));
			console.log(chalk.blue(`Total saved ${success} contacts`));
			if (typeof cb === 'function') cb();
		});

		contactsBatch.length = 0;
	}
}

export default importCSV;
