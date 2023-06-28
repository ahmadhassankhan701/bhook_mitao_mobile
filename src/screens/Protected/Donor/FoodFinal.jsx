import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Sizes, colors } from "../../../utils/theme";
import { useState } from "react";
import DonorMap from "../../../components/Map/DonorMap";
import { Button } from "react-native-paper";
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useEffect } from "react";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";

const FoodFinal = ({ route, navigation }) => {
	const { detail, identity } = route.params;
	const [location, setLocation] = useState({
		city: "",
		address: "",
		currentLocation: { lat: 0, lng: 0 },
	});
	const handleChange = async (address, city, pos) => {
		setLocation({
			...location,
			city,
			address,
			currentLocation: pos,
		});
	};
	const handleSubmit = async () => {
		if (
			location.city === "" ||
			location.address === "" ||
			location.currentLocation.lat === 0 ||
			location.currentLocation.lng === 0
		) {
			alert("Location not added yet");
			return;
		}
		navigation.navigate("FoodFinalOrg", {
			detail,
			identity,
			location,
		});
	};
	// const handleUpdate = async () => {
	// 	if (
	// 		location.city === "" ||
	// 		location.address === "" ||
	// 		location.currentLocation.lat === 0 ||
	// 		location.currentLocation.lng === 0
	// 	) {
	// 		alert("Location not added yet");
	// 		return;
	// 	}
	// 	try {
	// 		const data = {
	// 			detail,
	// 			identity,
	// 			location,
	// 			status: "requested",
	// 			userId,
	// 			city: location.city,
	// 			createdAt: serverTimestamp(),
	// 		};
	// 		setLoading(true);
	// 		const donationsRef = doc(
	// 			db,
	// 			`Donations/${userId}/food`,
	// 			`${docId}`
	// 		);
	// 		// Add a new document in collection "donations"
	// 		await updateDoc(donationsRef, data);
	// 		setLoading(false);
	// 		alert(
	// 			"Donation updated successfully. Keep checking for status!"
	// 		);
	// 		await sendNotification(
	// 			token,
	// 			"Food Donation",
	// 			"You have updated food donation request. Please wait for the organization to approve"
	// 		);
	// 		navigation.navigate("Homepage");
	// 	} catch (error) {
	// 		alert("Something went wrong");
	// 		console.log(error);
	// 	}
	// };
	return (
		<View style={styles.container}>
			{/* <Text>{JSON.stringify(location, null, 4)}</Text> */}
			<View style={styles.cover}>
				<DonorMap
					location={location}
					handleChange={handleChange}
				/>
			</View>
			<View
				style={{
					marginTop: 20,
					display: "flex",
					flexDirection: "row",
					gap: 10,
				}}
			>
				<Button
					icon={"arrow-left"}
					mode="contained"
					buttonColor={colors.primary}
					onPress={() => navigation.goBack()}
					style={{ borderRadius: 10 }}
				>
					Back
				</Button>
				<Button
					icon={"arrow-right"}
					mode="contained"
					buttonColor={colors.primary}
					onPress={handleSubmit}
					style={{
						borderRadius: 10,
					}}
					contentStyle={{ flexDirection: "row-reverse" }}
				>
					Next
				</Button>
			</View>
		</View>
	);
};

export default FoodFinal;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
		alignItems: "center",
		justifyContent: "center",
	},
	cover: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: Sizes.width - 10,
	},
});
