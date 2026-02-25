// import amqp from 'amqplib';

// async function makeConnection() {
// 	try {
// 		const connection = await amqp.connect(process.env.RABBITMQ_ADDRESS);
// 		const channel = await connection.createChannel();

// 		await channel.assertQueue('emails');
// 		console.log('RabbitMQ Connected');
// 		return [connection, channel];
// 	} catch (e) {
// 		console.error(e);
// 		return [null, null];
// 	}
// }

// const [connection, channel] = await makeConnection();

// export { connection, channel };
