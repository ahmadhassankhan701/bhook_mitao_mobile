import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import { Sizes, colors } from "../../../utils/theme";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
	ActivityIndicator,
	Avatar,
	Card,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
const Account = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [rider, setRider] = useState({});
	const [uploadedImage, setUploadedImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	useEffect(() => {
		const fetchRider = async () => {
			try {
				setLoading(true);
				const rider = doc(
					db,
					`Riders`,
					`${state.user.userId}`
				);
				const docSnap = await getDoc(rider);
				if (docSnap.exists()) {
					setLoading(false);
					const riderData = docSnap.data();
					setRider(riderData);
				} else {
					setLoading(false);
					navigation.navigate("Homepage");
				}
			} catch (error) {
				console.log(error);
			}
		};
		state && state.user && fetchRider();
	}, [state && state.user]);
	const userId = state && state.user && state.user.userId;
	const handleLogout = async () => {
		try {
			const docRef = doc(db, `Riders`, `${userId}`);
			await updateDoc(docRef, {
				location: {
					currentLocation: {
						lat: 0,
						lng: 0,
					},
				},
			});
			await AsyncStorage.removeItem("bhook_auth");
			setState({ ...state, user: null });
			navigation.navigate("Intro");
		} catch (error) {
			console.log(error);
		}
	};
	const handleImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Camera access is required");
			return;
		}
		// get image from gallery
		let pickerResult =
			await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		if (pickerResult.canceled === true) {
			return;
		}
		const path = `Profiles/${
			state.user.category
		}/${userId}/${Date.now()}`;
		const img = await uploadImage(
			path,
			pickerResult.assets[0].uri
		);
		setUploadedImage(img);
		await saveImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 100, height: 100 } }],
				{
					compress: 0.5,
					format: ImageManipulator.SaveFormat.JPEG,
				}
			);
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			return getDownloadURL(storageRef);
		}
		return null;
	};
	const saveImage = async (img) => {
		const riderDoc = doc(
			db,
			`Riders`,
			`${state.user.userId}`
		);
		await updateDoc(riderDoc, {
			image: img,
		});
		const userData = {
			userId: state.user.userId,
			category: "rider",
			image: img,
			name: rider.name,
		};
		const stateData = { userData };
		await AsyncStorage.setItem(
			"bhook_auth",
			JSON.stringify(stateData)
		);
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-between",
			}}
		>
			<Header showModal={showModal} />
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text style={{ textAlign: "center" }}>
							Are you sure you want to logout?
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<IconButton
								icon={"check-circle"}
								iconColor="green"
								size={35}
								onPress={handleLogout}
							/>
							<IconButton
								icon={"close-circle"}
								iconColor="red"
								size={35}
								onPress={hideModal}
							/>
						</View>
					</View>
				</Modal>
			</Portal>
			<View>
				<View style={styles.center}>
					{loading ? (
						<ActivityIndicator
							style={{ paddingTop: 50 }}
							size={50}
							animating={loading}
							color={colors.primary}
						/>
					) : (
						<Card style={styles.card}>
							<Card.Content style={styles.center}>
								<Avatar.Image
									size={100}
									source={
										uploadedImage != ""
											? { uri: uploadedImage }
											: rider.image != ""
											? { uri: rider.image }
											: require("../../../assets/helmetLogo.jpg")
									}
									style={{ marginVertical: 30 }}
								/>
								<IconButton
									icon={"camera"}
									mode="contained"
									containerColor={colors.primary}
									iconColor="white"
									onPress={handleImage}
								/>
								<Text
									style={{
										color: colors.desc,
										fontSize: Sizes.h2,
										marginVertical: 10,
										fontWeight: "600",
										letterSpacing: 5,
									}}
								>
									Rider
								</Text>
								<Text style={styles.cardText}>
									<Text style={styles.cardSubText}>
										Name:
									</Text>{" "}
									{rider.name}
								</Text>
								<Text style={styles.cardText}>
									<Text style={styles.cardSubText}>
										Phone:
									</Text>
									0{rider.phone}
								</Text>
							</Card.Content>
						</Card>
					)}
				</View>
			</View>
			<Footer />
		</View>
	);
};
const styles = StyleSheet.create({
	top: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: `${colors.primary}`,
		paddingVertical: 10,
		marginVertical: 10,
		width: Sizes.width - 20,
	},
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: Sizes.width - 20,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	cardText: {
		fontSize: 15,
		color: "dimgray",
		fontWeight: "600",
		letterSpacing: 5,
	},
	cardSubText: {
		fontWeight: "700",
		color: colors.primary,
	},
});

export default Account;
