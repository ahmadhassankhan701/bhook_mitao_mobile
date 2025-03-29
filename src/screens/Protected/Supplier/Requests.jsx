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
	IconButton,
} from "react-native-paper";
import {
	and,
	collectionGroup,
	getDocs,
	limit,
	onSnapshot,
	or,
	orderBy,
	query,
	startAfter,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import SupplierFooter from "../../../components/Footer/SupplierFooter";
import RequestCard from "../../../components/Card/RequestCard";
const Requests = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const userId =
		state && state.user ? state.user.userId : "";
	useEffect(() => {
		getRequests();
	}, []);
	const getRequests = async () => {
		try {
			const donations = query(
				collectionGroup(db, "food"),
				and(
					where("selectedOrg.orgId", "==", `${userId}`),
					or(
						where("status", "==", "requested"),
						where("status", "==", "pending"),
						where("status", "==", "assigned"),
						where("status", "==", "started")
					)
				),
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
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const donations = query(
				collectionGroup(db, "food"),
				and(
					where("selectedOrg.orgId", "==", `${userId}`),
					or(
						where("status", "==", "requested"),
						where("status", "==", "pending"),
						where("status", "==", "assigned"),
						where("status", "==", "started")
					)
				),
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
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<View style={styles.wrapper}>
					<Text
						style={{
							color: "white",
							marginVertical: 10,
							fontSize: 18,
							fontWeight: "600",
							lineHeight: 27,
						}}
					>
						Donation Requests
					</Text>
					<View
						style={{
							height: "90%",
						}}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									height: "100%",
								}}
							>
								{Object.keys(donations).length != 0 ? (
									donations.map((val) => (
										<RequestCard data={val} key={val.key} />
									))
								) : (
									<View
										style={{
											display: "flex",
											flexDirection: "row",
											alignItems: "center",
											marginTop: 200,
										}}
									>
										<Text
											style={{
												color: "#6F7378",
											}}
										>
											No Donations Requests{" "}
										</Text>
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
			</View>
			<View style={styles.footer}>
				<SupplierFooter />
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
	},
	footer: {
		height: Sizes.height * 0.2,
	},
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Requests;
