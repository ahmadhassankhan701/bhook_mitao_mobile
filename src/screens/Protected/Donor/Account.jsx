import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import DonorFooter from "../../../components/Footer/DonorFooter";
import { Sizes, colors } from "../../../utils/theme";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
	ActivityIndicator,
	Avatar,
	Card,
	IconButton,
	Modal,
	Button,
	Portal,
} from "react-native-paper";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../../firebase";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";

const Account = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [donor, setDonor] = useState(null);
	const [uploadedImage, setUploadedImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: colors.primary,
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	useEffect(() => {
		const fetchDonor = async () => {
			try {
				setLoading(true);
				const userRef = doc(
					db,
					"Auth/donor/users/",
					`${state.user.userId}`
				);
				const docSnap = await getDoc(userRef);
				if (docSnap.exists()) {
					setLoading(false);
					const userData = docSnap.data();
					setDonor(userData);
				} else {
					setLoading(false);
					navigation.navigate("Homepage");
				}
			} catch (error) {
				console.log(error);
			}
		};
		state && state.user && fetchDonor();
	}, [state && state.user]);
	const handleLogout = async () => {
		try {
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
		const path = `Profiles/donor/${
			donor.userId
		}/${Date.now()}`;
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
		const donorDoc = doc(
			db,
			`Auth/donor/users/`,
			`${state.user.userId}`
		);
		await updateDoc(donorDoc, {
			image: img,
		});
	};
	return (
		<View style={styles.container}>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text
							style={{
								textAlign: "center",
								color: "white",
							}}
						>
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
			<View style={styles.main}>
				{/* <Text style={{ color: "white" }}>
					{JSON.stringify(donor, null, 4)}
				</Text> */}

				<View style={styles.wrapper}>
					{loading ? (
						<ActivityIndicator
							style={{ paddingTop: 50 }}
							size={50}
							animating={loading}
							color={colors.primary}
						/>
					) : (
						donor && (
							<Card style={styles.card}>
								<Card.Content style={styles.center}>
									<Avatar.Image
										size={100}
										source={
											uploadedImage != ""
												? { uri: uploadedImage }
												: donor.image != ""
												? { uri: donor.image }
												: require("../../../assets/donorLogo.jpg")
										}
										style={{ marginVertical: 20 }}
									/>
									<IconButton
										icon={"camera"}
										mode="contained"
										containerColor={"#000"}
										iconColor="white"
										onPress={handleImage}
									/>
									<Text
										style={{
											color: "white",
											fontSize: Sizes.h2,
											marginVertical: 5,
											fontWeight: "600",
											letterSpacing: 5,
										}}
									>
										Donor
									</Text>
									<View>
										<Text style={styles.cardText}>
											<Text style={styles.cardSubText}>
												Name:
											</Text>{" "}
											{donor.name}
										</Text>
										<Text style={styles.cardText}>
											<Text style={styles.cardSubText}>
												Email:
											</Text>
											{donor.email}
										</Text>
									</View>
									{state.user &&
										state.user.provider &&
										state.user.provider == "custom" && (
											<Button
												icon="shield-key"
												mode="contained"
												buttonColor={"#000"}
												textColor="#fff"
												style={{ marginVertical: 10 }}
												onPress={() =>
													navigation.navigate("Reset")
												}
											>
												Reset Password
											</Button>
										)}
									<Button
										mode="contained"
										icon={"logout"}
										buttonColor="#000"
										textColor="#fff"
										style={{ marginVertical: 10 }}
										onPress={showModal}
									>
										Logout
									</Button>
								</Card.Content>
							</Card>
						)
					)}
				</View>
			</View>
			<View style={styles.footer}>
				<DonorFooter />
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	wrapper: {
		width: Sizes.width - 20,
		alignSelf: "center",
		marginTop: 20,
	},
	main: {
		height: Sizes.height * 0.8,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	footer: {
		height: Sizes.height * 0.2,
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
		backgroundColor: colors.primary,
		borderRadius: 10,
	},
	cardText: {
		fontSize: 15,
		color: "white",
		fontWeight: "600",
		letterSpacing: 2,
		textAlign: "left",
	},
	cardSubText: {
		fontWeight: "700",
		color: "white",
	},
});

export default Account;
