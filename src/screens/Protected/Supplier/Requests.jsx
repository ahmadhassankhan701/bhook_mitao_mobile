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
	getDocs,
	limit,
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
const Requests = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
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
		const donations = query(
			collectionGroup(db, "food"),
			where("assignedBy.orgId", "==", `${userId}`),
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
	}, []);
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const donations = query(
				collectionGroup(db, "food"),
				where("assignedBy.orgId", "==", `${userId}`),
				where("status", "==", "done"),
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
						Donations Done
					</Text>
					<ScrollView
						style={{ height: Sizes.height - 230 }}
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
										paddingTop: 200,
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

export default Requests;
