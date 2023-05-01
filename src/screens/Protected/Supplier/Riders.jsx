import {
	View,
	Text,
	StyleSheet,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Sizes, colors } from "../../../utils/theme";
import {
	ActivityIndicator,
	Button,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Header from "../../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SupplierFooter from "../../../components/Footer/SupplierFooter";
import RidersCard from "../../../components/Card/RidersCard";
const Riders = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [riders, setRiders] = useState([]);
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
	useEffect(() => {
		getRiders();
	}, []);
	const getRiders = async () => {
		const riders = query(
			collection(db, "Riders"),
			where("userId", "==", `${userId}`),
			orderBy("createdAt", "desc"),
			limit(2)
		);
		setLoading(true);
		onSnapshot(riders, (querySnapshot) => {
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
			setRiders(items);
		});
	};
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const riders = query(
				collection(db, "Riders"),
				where("userId", "==", `${userId}`),
				orderBy("createdAt", "desc"),
				startAfter(item.createdAt),
				limit(2)
			);
			try {
				setLoading(true);
				const querySnapshot = await getDocs(riders);
				if (querySnapshot.size == 0) {
					setLoading(false);
					setNextBtn(false);
				} else {
					setLoading(false);
					setNextBtn(true);
					querySnapshot.forEach((doc) => {
						setRiders((riders) => [
							...riders,
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
			await AsyncStorage.removeItem("bhook_auth");
			setState({ ...state, user: null });
			navigation.navigate("Intro");
		} catch (error) {
			console.log(error);
		}
	};
	const handleDelete = async (id) => {
		try {
			await deleteDoc(doc(db, `Riders`, `${id}`));
			alert("Rider Deleted");
		} catch (error) {
			alert("Deletion Failed");
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
					<View
						style={{
							paddingTop: 10,
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
							width: Sizes.width - 20,
						}}
					>
						<Text
							style={{
								color: "#000000",
								marginVertical: 5,
								fontSize: 18,
								fontWeight: "600",
								lineHeight: 27,
							}}
						>
							Riders
						</Text>
						<Text>
							<Button
								buttonColor={colors.primary}
								icon={"plus"}
								mode="contained"
								onPress={() =>
									navigation.navigate("AddRider")
								}
							>
								Add Rider
							</Button>
						</Text>
					</View>

					<ScrollView
						style={{ height: Sizes.height - 230 }}
						showsVerticalScrollIndicator={false}
					>
						<View>
							{Object.keys(riders).length != 0 ? (
								riders.map((val) => (
									<RidersCard
										data={val}
										key={val.key}
										handleDelete={handleDelete}
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
									<Text>No Riders Added Yet </Text>
									<Text>
										<IconButton icon={"racing-helmet"} />{" "}
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
													item: riders[riders.length - 1],
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
			<SupplierFooter />
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

export default Riders;
