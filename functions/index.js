/* eslint-disable */
const functions = require("firebase-functions");
const Stripe = require("stripe");
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const SECRET_KEY =
	"sk_test_51KJMVMSHhVKq4SOr7fxoyPS4HXMWiACzbmR8kZwGqgMiOiIoLbKnTc9mcsdAnkJMfqbGJ6SCL2eBrcEcpxutnWAO00dAQ7lpBa";
//Confirm the API version from your stripe dashboard
const stripe = Stripe(SECRET_KEY);
const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
admin.initializeApp();
app.get("/", (req, res) => {
	res.send("Hello from Firebase!");
});
// build multiple CRUD interfaces:
app.post("/create-payment-intent", async (req, res) => {
	const { amount } = req.body;
	try {
		const paymentIntent =
			await stripe.paymentIntents.create({
				amount: 1000, //lowest denomination of particular currency
				currency: "usd",
				payment_method_types: ["card"], //by default
			});
		// console.log(paymentIntent);
		const clientSecret = paymentIntent.client_secret;

		res.json({
			clientSecret: clientSecret,
		});
	} catch (e) {
		console.log(e.message);
		res.json({ error: e.message });
	}
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
