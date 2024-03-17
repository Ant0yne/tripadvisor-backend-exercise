require("dotenv").config();
const express = require("express");
const cors = require("cors");
const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(cors());
app.use(express.json());

const mailgun = new Mailgun(formData);
const clientMailgun = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY,
});

app.all("/", (req, res) => {
	res.status(200).json({
		message: "Bienvenue sur Tripadvisor ! (pas le vrai c'est un exercice)",
	});
});

app.post("/form", async (req, res) => {
	try {
		const { firstname, lastname, email, message } = req.body;

		const messageData = {
			from: `${firstname} ${lastname} <${email}>`,
			to: email,
			subject: "Formulaire TripAdvisor Exercice",
			text: message,
		};

		const response = await clientMailgun.messages.create(
			process.env.MAILGUN_DOMAIN,
			messageData
		);

		console.log(response);

		res.status(200).json(response);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

app.all("*", (req, res) => {
	res.status(404).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
	console.log("SERVER ON");
});
