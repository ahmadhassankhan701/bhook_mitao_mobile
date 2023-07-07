import React, { useState } from "react";
import { View, StyleSheet, TextInput } from "react-native";
import {
	CardField,
	useConfirmPayment,
} from "@stripe/stripe-react-native";
import axios from "axios";
import {
	addDoc,
	collection,
	serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Sizes, colors } from "../../utils/theme";
import { Button } from "react-native-paper";
import Success from "../Modal/Success";
import Failure from "../Modal/Failure";
//ADD localhost address of your server
// const API_URL =
// 	"http://127.0.0.1:5001/bhook-mita/us-central1/api";
const API_URL =
	"https://us-central1-bhook-mita.cloudfunctions.net/api";

const StripeApp = (props) => {
	const { state } = useContext(AuthContext);
	const navigation = useNavigation();
	const [email, setEmail] = useState();
	const [amount, setAmount] = useState();
	const [successAlert, setSuccessAlert] = useState(false);
	const [failureAlert, setFailureAlert] = useState(false);
	const [cardDetails, setCardDetails] = useState();
	const { confirmPayment, loading } = useConfirmPayment();
	const userId = state && state.user && state.user.userId;
	const token =
		state && state.user && state.user.push_token;

	const fetchPaymentIntentClientSecret = async () => {
		try {
			const response = await fetch(
				`${API_URL}/create-payment-intent`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ amount }),
				}
			);
			const { clientSecret, error } = await response.json();
			return { clientSecret, error };
		} catch (error) {
			console.log(error);
		}
	};

	const handlePayPress = async () => {
		//1.Gather the customer's billing information (e.g., email)
		if (!cardDetails?.complete || !email || !amount) {
			alert(
				"Please enter Complete card details, amount and Email"
			);
			return;
		}
		// 2.Fetch the intent client secret from the backend
		try {
			const { clientSecret, error } =
				await fetchPaymentIntentClientSecret();
			//2. confirm the payment
			if (error) {
				// console.log("Unable to process payment");
				alert(error);
			} else {
				saveMoneyDonation(clientSecret);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const saveMoneyDonation = async (cSecret) => {
		try {
			const donationsRef = collection(db, "Donations");
			const request = {
				amount,
				client_secret: cSecret,
				currency: "usd",
				receipt_email: email,
				status: "paid",
				userId,
				createdAt: serverTimestamp(),
			};
			// Add a new document in collection "donations"

			await addDoc(
				collection(donationsRef, `${userId}`, "money"),
				request
			);
			setSuccessAlert(true);
			alert("Donation done successfully");
			navigation.navigate("Homepage");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<View style={styles.container}>
			<Failure
				visible={failureAlert}
				setVisible={setFailureAlert}
				title={"Donation Failed"}
				icon={"exclamation-thick"}
			/>
			<Success
				visible={successAlert}
				setVisible={setSuccessAlert}
				title={"Congratulations! You just made a donation"}
				icon={"check-circle"}
			/>
			<View style={styles.wrapper}>
				<TextInput
					autoCapitalize="none"
					placeholder="E-mail *"
					keyboardType="email-address"
					onChange={(value) =>
						setEmail(value.nativeEvent.text)
					}
					style={styles.input}
				/>
				<TextInput
					placeholder="Amount (usd) *"
					keyboardType="numeric"
					onChange={(value) =>
						setAmount(value.nativeEvent.text)
					}
					style={styles.input}
				/>
				<CardField
					postalCodeEnabled={true}
					placeholder={{
						number: "4242 4242 4242 4242",
					}}
					cardStyle={styles.card}
					style={styles.cardContainer}
					onCardChange={(cardDetails) => {
						setCardDetails(cardDetails);
					}}
				/>
				<Button
					onPress={handlePayPress}
					disabled={loading}
					textColor="#ffffff"
					style={{
						backgroundColor: colors.primary,
						borderRadius: 10,
					}}
				>
					Pay
				</Button>
			</View>
		</View>
	);
};
export default StripeApp;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	wrapper: {
		width: Sizes.width - 20,
	},
	input: {
		backgroundColor: "#efefefef",
		borderRadius: 8,
		fontSize: 20,
		height: 50,
		padding: 10,
		marginVertical: 10,
	},
	card: {
		backgroundColor: "#efefefef",
		borderRadius: 10,
	},
	cardContainer: {
		height: 50,
		marginVertical: 20,
	},
});
