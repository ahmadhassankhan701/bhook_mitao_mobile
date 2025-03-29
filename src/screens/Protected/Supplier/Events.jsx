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
	collectionGroup,
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
import { db, storage } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import SupplierFooter from "../../../components/Footer/SupplierFooter";
import EventsCard from "../../../components/Card/EventsCard";
import { deleteObject, ref } from "firebase/storage";
import Failure from "../../../components/Modal/Failure";
import Success from "../../../components/Modal/Success";
const Events = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [events, setEvents] = useState([]);
	const [nextBtn, setNextBtn] = useState(false);
	const [loading, setLoading] = useState(false);
	const [deleteSuccess, setDeleteSuccess] = useState(false);
	const [deleteFail, setDeleteFail] = useState(false);
	const userId =
		state && state.user ? state.user.userId : "";
	useEffect(() => {
		getEvents();
	}, []);
	const getEvents = async () => {
		const events = query(
			collectionGroup(db, "event"),
			where("orgId", "==", `${userId}`),
			orderBy("createdAt", "desc"),
			limit(2)
		);
		setLoading(true);
		onSnapshot(events, (querySnapshot) => {
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
			setEvents(items);
		});
	};
	const showNext = ({ item }) => {
		const fetchNextData = async () => {
			const events = query(
				collectionGroup(db, "event"),
				where("orgId", "==", `${userId}`),
				orderBy("createdAt", "desc"),
				startAfter(item.createdAt),
				limit(2)
			);
			try {
				setLoading(true);
				const querySnapshot = await getDocs(events);
				if (querySnapshot.size == 0) {
					setLoading(false);
					setNextBtn(false);
				} else {
					setLoading(false);
					setNextBtn(true);
					querySnapshot.forEach((doc) => {
						setEvents((events) => [
							...events,
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
	const handleDelete = async (orgId, docId, path) => {
		try {
			await deleteImages(path);
			const eventRef = doc(
				db,
				`Events/${orgId}/event`,
				`${docId}`
			);
			await deleteDoc(eventRef);
			setDeleteSuccess(true);
		} catch (error) {
			setDeleteFail(true);
			console.log(error);
		}
	};
	const deleteImages = async (path) => {
		const fileRef = ref(storage, path);
		await deleteObject(fileRef);
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
				title={"Event Deleted"}
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
							Events
						</Text>
						<IconButton
							onPress={() =>
								navigation.navigate("AddEvents")
							}
							icon={"plus-circle"}
							size={35}
						/>
					</View>
					<ScrollView
						style={{
							height: "87%",
						}}
						contentContainerStyle={{
							justifyContent: "center",
							alignItems: "center",
						}}
						showsVerticalScrollIndicator={false}
					>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							{Object.keys(events).length != 0 ? (
								events.map((val) => (
									<EventsCard
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
										No Events Added Yet{" "}
									</Text>
									<Text>
										<IconButton icon={"calendar"} />{" "}
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
													item: events[events.length - 1],
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

export default Events;
