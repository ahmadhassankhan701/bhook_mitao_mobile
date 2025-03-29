import { StyleSheet, View } from "react-native";
import React from "react";
import { Sizes, colors } from "../utils/theme";
import { useState } from "react";
import DonorMap from "../components/Map/DonorMap";
import { Button } from "react-native-paper";
import {
	doc,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import {
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";
const SupplierRegisterFinal = ({ route, navigation }) => {
	const { data } = route.params;
	const [loading, setLoading] = useState(false);
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
		setLoading(true);
		createUserWithEmailAndPassword(
			auth,
			data.email,
			data.password
		)
			.then((userCredential) => {
				// Signed in
				const users = userCredential.user;
				updateProfile(auth.currentUser, {
					displayName: data.name,
				});
				handleAddOrg(users);
			})
			.catch((error) => {
				const errorMessage = error.message;
				setLoading(false);
				alert(errorMessage);
				console.log(error);
			});
	};
	const handleAddOrg = async (users) => {
		let user = {
			category: data.category,
			status: "requested",
			name: data.name,
			email: data.email,
			pd: data.password,
			image: "",
			location,
			createdAt: serverTimestamp(),
		};
		setDoc(
			doc(db, `Auth/${data.category}/users`, users.uid),
			user
		)
			.then(() => {
				setLoading(false);
				alert(
					"Success. Once your details are verified we will send you a verification email"
				);
				navigation.navigate("login", { categ: "supplier" });
			})
			.catch((e) => {
				alert("Error adding document user");
				console.log(e);
				setLoading(false);
			});
	};
	return (
		<View style={styles.container}>
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
					gap: 5,
				}}
			>
				<Button
					icon={"arrow-left"}
					mode="outlined"
					textColor={colors.primary}
					onPress={() => navigation.goBack()}
					style={{
						borderColor: colors.primary,
						borderRadius: 10,
					}}
				>
					Back
				</Button>
				<Button
					icon={"login"}
					mode="contained"
					buttonColor={colors.primary}
					onPress={handleSubmit}
					loading={loading}
					disabled={loading}
					style={{ borderRadius: 10 }}
				>
					Register
				</Button>
			</View>
		</View>
	);
};

export default SupplierRegisterFinal;

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
