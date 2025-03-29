import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Sizes, colors } from "../../../utils/theme";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import OrgList from "../../../components/Table/OrgList";
import { ScrollView } from "react-native";
import {
	ActivityIndicator,
	Button,
	IconButton,
} from "react-native-paper";
import {
	addDoc,
	collection,
	collectionGroup,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where,
} from "firebase/firestore";
import haversineDistance from "haversine-distance";
import { db } from "../../../../firebase";
import { AuthContext } from "../../../context/AuthContext";
import { sendNotification } from "../../../utils/Helpers/NotifyConfig";
import Confirm from "../../../components/Modal/Confirm";
import Failure from "../../../components/Modal/Failure";
import Success from "../../../components/Modal/Success";
const FoodFinalOrg = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const { detail, identity, location } = route.params;
	const [range, setRange] = useState("");
	const [orgs, setOrgs] = useState(null);
	const [selectedOrg, setSelectedOrg] = useState(null);
	const [loading, setLoading] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [failureAlert, setFailureAlert] = useState(true);
	const [visible, setVisible] = useState(false);
	const [submitLoading, setSubmitLoading] = useState(false);
	const push_token =
		state && state.user && state.user.push_token;
	const userId = state && state.user && state.user.userId;
	useEffect(() => {
		state && state.user && getOrgs(5);
	}, [state && state.user]);
	const getOrgs = async (range) => {
		setLoading(true);
		const orgs = query(
			collectionGroup(db, "users"),
			where("category", "==", "supplier"),
			orderBy("name", "asc")
		);
		const items = [];
		getDocs(orgs)
			.then((querySnapshot) => {
				if (querySnapshot.size == 0) {
					setOrgs(null);
					setLoading(false);
					return;
				}
				querySnapshot.forEach((doc) => {
					items.push({ key: doc.id, ...doc.data() });
				});
				filterByRange(items, range);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	const filterByRange = async (items, range) => {
		if (items) {
			let kmRange = range * 1000;
			const filteredOrgs = items.filter((item) => {
				let distance = haversineDistance(
					{
						latitude: item.location.currentLocation.lat,
						longitude: item.location.currentLocation.lng,
					},
					{
						latitude: location.currentLocation.lat,
						longitude: location.currentLocation.lng,
					}
				);
				if (distance <= kmRange) {
					return true;
				}
			});
			if (Object.keys(filteredOrgs).length == 0) {
				setOrgs(null);
				setLoading(false);
				return;
			} else {
				setOrgs(filteredOrgs);
			}
			setLoading(false);
		}
	};
	const handleDonationRequest = async () => {
		setVisible(false);
		handleSubmit();
	};
	const handleSubmit = async () => {
		if (selectedOrg == null) {
			alert("Please select the organization to proceed!");
			return;
		}
		try {
			const data = {
				detail,
				identity,
				location,
				selectedOrg,
				status: "requested",
				userId,
				push_token,
				createdAt: serverTimestamp(),
			};
			setSubmitLoading(true);
			const donationsRef = collection(db, "Donations");
			await addDoc(
				collection(donationsRef, `${userId}`, "food"),
				data
			);
			setSubmitLoading(false);
			await sendNotification(
				selectedOrg.push_token,
				"Food Donation Request",
				"You have new food donation request. Please have a look and take action!"
			);
			setSuccessAlert(true);
			navigation.navigate("Homepage");
		} catch (error) {
			setFailureAlert(true);
			console.log(error);
		}
	};
	return (
		<View style={styles.container}>
			<Confirm
				visible={visible}
				setVisible={setVisible}
				title={"Are you sure?"}
				subtitle={
					"You won't be able to edit details later!"
				}
				icon={"alert"}
				handleAction={handleDonationRequest}
			/>
			<Failure
				visible={failureAlert}
				setVisible={setFailureAlert}
				title={"Donation Request Failed"}
				icon={"exclamation-thick"}
			/>
			<Success
				visible={successAlert}
				setVisible={setSuccessAlert}
				title={
					"Thanks for Donation Request. Once approved by Organization, you will be notified!"
				}
				icon={"check-circle"}
			/>
			<View style={styles.main}>
				<View>
					<Text
						style={{
							color: "white",
							marginBottom: 5,
							fontSize: 15,
						}}
					>
						Distance Range (kms)
					</Text>
					<View
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							width: Sizes.width - 50,
							backgroundColor: colors.primary,
							padding: 10,
							borderRadius: 10,
						}}
					>
						<Text style={{ color: "white", fontSize: 15 }}>
							5
						</Text>
						<Slider
							style={{ width: 250, height: 50 }}
							minimumValue={5}
							maximumValue={15}
							minimumTrackTintColor="#FFFFFF"
							maximumTrackTintColor="#FFFFFF"
							step={1}
							onSlidingComplete={(value) => {
								setRange(value);
								getOrgs(value);
							}}
						/>
						<Text style={{ color: "white", fontSize: 15 }}>
							{range == "" ? 15 : range}
						</Text>
					</View>
				</View>
				<View
					style={{
						height: 500,
					}}
				>
					<ScrollView showsVerticalScrollIndicator={false}>
						{loading ? (
							<ActivityIndicator
								style={{ paddingTop: 50 }}
								size={50}
								animating={loading}
								color={colors.primary}
							/>
						) : orgs ? (
							<OrgList
								orgs={orgs}
								selectedOrg={selectedOrg}
								setSelectedOrg={setSelectedOrg}
							/>
						) : (
							<Text
								style={{
									color: "white",
									textAlign: "center",
									fontSize: 18,
									marginTop: 50,
								}}
							>
								No Organizations in this range
							</Text>
						)}
					</ScrollView>
				</View>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "center",
						gap: 10,
					}}
				>
					<Button
						icon={"arrow-left"}
						mode="contained"
						buttonColor={colors.primary}
						onPress={() => navigation.goBack()}
						style={{ borderRadius: 10 }}
					>
						Back
					</Button>
					<Button
						icon={"charity"}
						mode="contained"
						buttonColor={colors.primary}
						onPress={() => setVisible(true)}
						style={{
							borderRadius: 10,
						}}
						loading={submitLoading}
						contentStyle={{ flexDirection: "row-reverse" }}
					>
						Request Donation
					</Button>
				</View>
			</View>
		</View>
	);
};

export default FoodFinalOrg;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	main: {
		width: Sizes.width - 50,
	},
});
