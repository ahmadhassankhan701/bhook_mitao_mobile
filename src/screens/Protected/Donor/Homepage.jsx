import {
	View,
	Text,
	StyleSheet,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Sizes, colors } from "../../../utils/theme";
import Done from "../../../components/Card/Done";
import {
	ActivityIndicator,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import {
	collectionGroup,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { activateNotify } from "../../../utils/Helpers/NotifyConfig";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DonorFooter from "../../../components/Footer/DonorFooter";
import MoneyDone from "../../../components/Card/MoneyDone";
const Homepage = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [moneyDonations, setMoneyDonations] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
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
	const userId =
		state && state.user ? state.user.userId : "";
	const donorDoc = doc(db, `Auth/donor/users/`, userId);
	useEffect(() => {
		activateNotification();
		getDonations();
		getMoneyDonations();
	}, []);
	const getMoneyDonations = async () => {
		const mdonations = query(
			collectionGroup(db, "money"),
			where("userId", "==", `${userId}`),
			orderBy("createdAt", "desc")
		);
		try {
			const querySnapshot = await getDocs(mdonations);
			const items = [];
			querySnapshot.forEach((doc) => {
				items.push({ key: doc.id, ...doc.data() });
			});
			setMoneyDonations(items);
		} catch (error) {
			console.log(error);
		}
	};
	const activateNotification = async () => {
		try {
			const push_token = await activateNotify(donorDoc);
			const userData = {
				userId,
				category:
					state && state.user && state.user.category,
				email: state && state.user && state.user.email,
				image: state && state.user && state.user.image,
				name: state && state.user && state.user.name,
				provider:
					state && state.user && state.user.provider,
				push_token,
			};
			const stateData = { userData };
			await AsyncStorage.setItem(
				"bhook_auth",
				JSON.stringify(stateData)
			);
			setState({ ...state, user: userData });
		} catch (error) {
			console.log(error);
		}
	};
	const getDonations = async () => {
		const donations = query(
			collectionGroup(db, "food"),
			where("userId", "==", `${userId}`),
			where("status", "==", "done"),
			orderBy("createdAt", "desc"),
			limit(2)
		);
		setLoading(true);
		getDocs(donations)
			.then((querySnapshot) => {
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
			})
			.catch((error) => {
				setLoading(true);
				console.log(error);
			});
	};
	const handleLogout = async () => {
		try {
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
						Completed Food Donations
					</Text>
					<ScrollView
						style={{
							height: Sizes.height - 500,
						}}
						showsVerticalScrollIndicator={false}
					>
						<View>
							{Object.keys(donations).length != 0 ? (
								donations.map((val) => (
									<Done
										by={"donor"}
										data={val}
										key={val.key}
									/>
								))
							) : (
								<View
									style={{
										paddingTop: 100,
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Text>No Donations Done Yet </Text>
									<Text>
										<IconButton icon={"charity"} />{" "}
									</Text>
								</View>
							)}
						</View>
					</ScrollView>
					<Text
						style={{
							color: "#000000",
							marginVertical: 5,
							fontSize: 18,
							fontWeight: "600",
							lineHeight: 27,
						}}
					>
						Completed Money Donations
					</Text>
					<ScrollView
						style={{
							height: Sizes.height - 500,
						}}
						showsVerticalScrollIndicator={false}
					>
						<View>
							{Object.keys(moneyDonations).length != 0 ? (
								moneyDonations.map((val) => (
									<MoneyDone data={val} key={val.key} />
								))
							) : (
								<View
									style={{
										paddingTop: 100,
										display: "flex",
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Text>No Donations Done Yet </Text>
									<Text>
										<IconButton icon={"charity"} />{" "}
									</Text>
								</View>
							)}
						</View>
					</ScrollView>
				</View>
			</View>
			<DonorFooter />
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

export default Homepage;
