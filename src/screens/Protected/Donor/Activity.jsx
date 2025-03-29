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
	deleteDoc,
	doc,
	getDocs,
	limit,
	onSnapshot,
	or,
	orderBy,
	query,
	startAfter,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import DonorFooter from "../../../components/Footer/DonorFooter";
import DonorActivity from "../../../components/Card/DonorActivity";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";
import Failure from "../../../components/Modal/Failure";
import Success from "../../../components/Modal/Success";
const Activity = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [deleteSuccessAlert, setDeleteSuccessAlert] =
		useState(false);
	const [completeSuccessAlert, setCompleteSuccessAlert] =
		useState(false);
	const [deleteFailAlert, setDeleteFailAlert] =
		useState(false);
	const [completeFailAlert, setCompleteFailAlert] =
		useState(false);
	const [completeLoading, setCompleteLoading] =
		useState(false);
	const userId =
		state && state.user ? state.user.userId : "";
	useEffect(() => {
		getDonations();
	}, []);
	const getDonations = async () => {
		const donations = query(
			collectionGroup(db, "food"),
			and(
				where("userId", "==", `${userId}`),
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
	};
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const donations = query(
				collectionGroup(db, "food"),
				and(
					where("userId", "==", `${userId}`),
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
	const handleDelete = async (uid, docId, orgToken) => {
		try {
			const donationsRef = doc(
				db,
				`Donations/${uid}/food`,
				`${docId}`
			);
			await deleteDoc(donationsRef);
			await sendNotification(
				orgToken,
				"Food Donation Request Cancelled",
				"Unfortunately, user has cancelled the donation!"
			);
			setDeleteSuccessAlert(true);
		} catch (error) {
			setDeleteFailAlert(true);
			console.log(error);
		}
	};
	const completeDonation = async (
		uid,
		docId,
		orgToken,
		riderToken
	) => {
		try {
			setCompleteLoading(true);
			const done = { donor: true, rider: false };
			const status = "pending";
			const donationsRef = doc(
				db,
				`Donations/${uid}/food`,
				`${docId}`
			);
			const request = {
				done,
				status,
			};
			await updateDoc(donationsRef, request);
			await sendNotification(
				orgToken,
				"Donor Approved",
				"Congratulations. Donor has approved for completion. Waiting for Rider!"
			);
			await sendNotification(
				riderToken,
				"Donor Approved",
				"Congratulations. Donor has approved for completion. Waiting for Rider!"
			);
			setCompleteLoading(false);
			setCompleteSuccessAlert(true);
		} catch (error) {
			setCompleteFailAlert(true);
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			<Failure
				visible={deleteSuccessAlert}
				setVisible={setDeleteSuccessAlert}
				title={"Donation Request Cancelled"}
				icon={"delete-circle"}
			/>
			<Failure
				visible={deleteFailAlert}
				setVisible={setDeleteFailAlert}
				title={"Cancellation Failed"}
				icon={"delete-circle"}
			/>
			<Failure
				visible={completeFailAlert}
				setVisible={setCompleteFailAlert}
				title={"Completion Failed"}
				icon={"alert-circle"}
			/>
			<Success
				visible={completeSuccessAlert}
				setVisible={setCompleteSuccessAlert}
				title={
					"Congratulations. Please wait for rider to confirm Completion"
				}
				icon={"check-circle"}
			/>
			<View style={styles.main}>
				<View style={styles.wrapper}>
					<Text
						style={{
							color: "white",
							marginTop: 30,
							fontSize: 25,
							fontWeight: "600",
							lineHeight: 27,
						}}
					>
						Current Donations
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
								}}
							>
								{Object.keys(donations).length != 0 ? (
									donations.map((val) => (
										<DonorActivity
											data={val}
											key={val.key}
											handleDelete={handleDelete}
											completeDonation={completeDonation}
											completeLoading={completeLoading}
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
											No Activity Yet{" "}
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

export default Activity;
