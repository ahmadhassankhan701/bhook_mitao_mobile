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
	deleteField,
	doc,
	getDocs,
	limit,
	onSnapshot,
	or,
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
import AssignedCard from "../../../components/Card/AssignedCard";
import RiderFooter from "../../../components/Footer";
const Activity = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [denyloading, setDenyloading] = useState(false);
	const userId = state && state.user && state.user.userId;
	useEffect(() => {
		const donations = query(
			collectionGroup(db, "food"),
			and(
				where("assignedTo.riderId", "==", `${userId}`),
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
	}, []);
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const donations = query(
				collectionGroup(db, "food"),
				and(
					where("assignedTo.riderId", "==", `${userId}`),
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
		<View style={styles.container}>
			<View style={styles.main}>
				<View style={styles.wrapper}>
					<Text
						style={{
							color: "#fff",
							marginVertical: 5,
							fontSize: 18,
							fontWeight: "600",
							lineHeight: 27,
						}}
					>
						Donations Assigned
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
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								{Object.keys(donations).length == 0 ? (
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
										<Text style={{ color: colors.primary }}>
											No Donations Assigned Yet{" "}
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
				<RiderFooter />
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
});

export default Activity;
