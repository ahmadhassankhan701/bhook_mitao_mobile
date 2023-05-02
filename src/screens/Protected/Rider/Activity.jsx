import {
	View,
	Text,
	StyleSheet,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import { Sizes, colors } from "../../../utils/theme";
import {
	ActivityIndicator,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import {
	collectionGroup,
	deleteField,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	startAfter,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import AssignedCard from "../../../components/Card/AssignedCard";
const Activity = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [denyloading, setDenyloading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	const userId = state && state.user && state.user.userId;
	useEffect(() => {
		const donations = query(
			collectionGroup(db, "food"),
			where("assignedTo.riderId", "==", `${userId}`),
			where("status", "!=", "done"),
			orderBy("status", "desc"),
			orderBy("createdAt", "desc"),
			limit(2)
		);
		setLoading(true);
		onSnapshot(donations, (querySnapshot) => {
			let items = [];
			if (querySnapshot.size == 0) {
				setLoading(false);
				setNextBtn(false);
			} else {
				setLoading(false);
				setNextBtn(true);
				querySnapshot.forEach((doc) => {
					items.push({ key: doc.id, ...doc.data() });
				});
			}
			setDonations(items);
		});
	}, []);
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const donations = query(
				collectionGroup(db, "food"),
				where("assignedTo.riderId", "==", `${userId}`),
				where("status", "!=", "done"),
				orderBy("status", "desc"),
				orderBy("createdAt", "desc"),
				startAfter(item.createdAt),
				limit(2)
			);
			try {
				setLoading(true);
				const querySnapshot = await getDocs(donations);
				if (querySnapshot.size == 0) {
					setLoading(false);
					setNextBtn(false);
				} else {
					setLoading(false);
					setNextBtn(true);
					querySnapshot.forEach((doc) => {
						setDonations((donations) => [
							...donations,
							{ key: doc.id, ...doc.data() },
						]);
					});
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchNextData();
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
	const handleDeny = async (docId, userId) => {
		try {
			const donationsRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			const request = {
				assignedBy: deleteField(),
				assignedTo: deleteField(),
				status: "requested",
			};
			setDenyloading(true);
			await updateDoc(donationsRef, request);
			setDenyloading(false);
			alert("You denied the donation request!");
		} catch (error) {
			alert("Something went wrong!");
			console.log(error);
		}
	};
	const handleStart = async (docId, userId) => {
		try {
			const status = "started";
			const request = {
				status,
				createdAt: serverTimestamp(),
			};
			const donationsRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			await updateDoc(donationsRef, request);
			alert("Good Luck. Donor is waiting!");
		} catch (error) {
			alert("Something went wrong!");
			console.log(error);
		}
	};
	const completeDonation = async (docId, userId) => {
		try {
			const done = {
				donor: false,
				rider: true,
				org: false,
			};
			const status = "pending";
			const donationsRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			const request = {
				done,
				status,
			};
			await updateDoc(donationsRef, request);
			alert(
				"Success. Wait for Donor to confirm Completion"
			);
		} catch (error) {
			alert("Something went wrong!");
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
				<View style={styles.center}>
					<Text
						style={{
							color: "#000000",
							marginVertical: 5,
							fontSize: 18,
							fontWeight: "600",
							lineHeight: 27,
						}}
					>
						Donations Assigned
					</Text>
					<ScrollView
						style={{ height: Sizes.height - 230 }}
						showsVerticalScrollIndicator={false}
					>
						<View>
							{Object.keys(donations).length != 0 ? (
								donations.map((val) => (
									<AssignedCard
										data={val}
										key={val.key}
										handleDeny={handleDeny}
										handleStart={handleStart}
										completeDonation={completeDonation}
										denyloading={denyloading}
									/>
								))
							) : (
								<View
									style={{
										paddingTop: 200,
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Text>No Donations Assigned Yet </Text>
									<Text>
										<IconButton icon={"charity"} />{" "}
									</Text>
								</View>
							)}
							{loading ? (
								<ActivityIndicator
									style={{ paddingTop: 50 }}
									size={50}
									animating={loading}
									color={colors.primary}
								/>
							) : (
								nextBtn && (
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<IconButton
											mode="contained"
											icon={"chevron-down-circle"}
											containerColor={colors.primary}
											iconColor="white"
											onPress={() =>
												showNext({
													item: donations[
														donations.length - 1
													],
												})
											}
										/>
									</View>
								)
							)}
						</View>
					</ScrollView>
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
});

export default Activity;
