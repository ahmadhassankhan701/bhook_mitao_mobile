import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import { Sizes, colors } from "../../../utils/theme";
import {
	ActivityIndicator,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import DetailCard from "../../../components/Card/DetailCard";
import Basic from "../../../components/Map/Basic";

const Detail = ({ navigation, route }) => {
	const { state, setState } = useContext(AuthContext);
	const [userData, setUserData] = useState({
		image: "",
		name: "",
	});
	const [docData, setDocData] = useState({
		userId: "",
		status: "",
		desc: "",
		quantity: "",
		phone: "",
	});
	const [location, setLocation] = useState({
		city: "",
		address: "",
		currentLocation: { lat: 0, lng: 0 },
	});
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
		const { docId, userId } = route.params;
		const docRef = doc(
			db,
			`Donations/${userId}/food`,
			`${docId}`
		);
		const userRef = doc(
			db,
			"Auth/donor/users/",
			`${userId}`
		);
		fetchUserData(userRef);
		fetchDocData(docRef);
	}, []);
	const fetchDocData = async (ref) => {
		try {
			const docSnap = await getDoc(ref);
			if (docSnap.exists()) {
				const reqDonation = docSnap.data();
				setDocData({
					...docData,
					userId: reqDonation.userId,
					status: reqDonation.status,
					quantity: reqDonation.detail.quantity,
					desc: reqDonation.detail.desc,
					phone: reqDonation.detail.phone,
				});
				setLocation({
					...location,
					address: reqDonation.location.address,
					city: reqDonation.location.city,
					currentLocation:
						reqDonation.location.currentLocation,
				});
			} else {
				alert("No such Document!");
				navigation.navigate("Activity");
			}
		} catch (error) {
			alert("Something went wrong!");
			console.log(error);
			navigation.navigate("Activity");
		}
	};
	const fetchUserData = async (ref) => {
		try {
			setLoading(true);
			const docSnap = await getDoc(ref);
			if (docSnap.exists()) {
				setLoading(false);
				const reqUser = docSnap.data();
				setUserData({
					...userData,
					name: reqUser.name,
					email: reqUser.email,
					image: reqUser.image,
				});
			} else {
				alert("No such document!");
				setLoading(false);
				navigation.navigate("Activity");
			}
		} catch (error) {
			alert("Something went wrong!");
			console.log(error);
			navigation.navigate("Activity");
		}
	};
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
				{loading ? (
					<ActivityIndicator
						style={{ paddingTop: 50 }}
						size={50}
						animating={loading}
						color={colors.primary}
					/>
				) : (
					<View style={styles.center}>
						<View>
							<DetailCard
								userData={userData}
								docData={docData}
								location={location}
							/>
							<Basic
								location={location}
								markerImg={"pin"}
							/>
						</View>
					</View>
				)}
			</View>
			<Footer />
		</View>
	);
};
const styles = StyleSheet.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Detail;
