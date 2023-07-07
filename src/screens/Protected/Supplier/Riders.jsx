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
import SupplierFooter from "../../../components/Footer/SupplierFooter";
import RidersCard from "../../../components/Card/RidersCard";
import Failure from "../../../components/Modal/Failure";
const Riders = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [riders, setRiders] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [deleteSuccess, setDeleteSuccess] = useState(false);
	const [deleteFail, setDeleteFail] = useState(false);
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
	const handleDelete = async (id) => {
		try {
			await deleteDoc(doc(db, `Riders`, `${id}`));
			setDeleteSuccess(true);
		} catch (error) {
			setDeleteFail(true);
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			<Failure
				visible={deleteFail}
				setVisible={setDeleteFail}
				title={"Deletion Failed"}
				icon={"exclamation-thick"}
			/>
			<Failure
				visible={deleteSuccess}
				setVisible={setDeleteSuccess}
				title={"Rider Deleted"}
				icon={"delete-circle"}
			/>
			<View style={styles.main}>
				<View style={styles.wrapper}>
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
								color: "#fff",
								marginVertical: 5,
								fontSize: 18,
								fontWeight: "600",
								lineHeight: 27,
							}}
						>
							Riders
						</Text>
						<IconButton
							onPress={() =>
								navigation.navigate("AddRider")
							}
							icon={"plus-circle"}
							size={35}
						/>
					</View>
					<View
						style={{
							height: "87%",
						}}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
							<View style={styles.center}>
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
										<Text style={{ color: colors.primary }}>
											No Riders Added Yet{" "}
										</Text>
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

export default Riders;
