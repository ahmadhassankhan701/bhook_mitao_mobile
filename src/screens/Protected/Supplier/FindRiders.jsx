import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useEffect } from "react";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useState } from "react";
import NearestRiders from "../../../components/Map/NearestRiders";

const FindRiders = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const [riders, setRiders] = useState([]);
	const [loading, setLoading] = useState(false);
	const [donorLoc, setDonorLoc] = useState(null);
	const { docId, userId } = route.params;
	const orgId = state && state.user && state.user.userId;
	const orgName = state && state.user && state.user.name;
	useEffect(() => {
		if (docId && userId) {
			getRiders();
			getDonorLoc(docId, userId);
		}
	}, [docId && userId]);
	const getRiders = async () => {
		const riders = query(
			collection(db, "Riders"),
			where("userId", "==", `${orgId}`),
			orderBy("createdAt", "desc")
		);
		onSnapshot(riders, (querySnapshot) => {
			let items = [];
			querySnapshot.forEach((doc) => {
				items.push({
					key: doc.id,
					...doc.data(),
				});
			});
			setRiders(items);
		});
	};
	const getDonorLoc = async (docId, userId) => {
		try {
			const donationsRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			const docSnap = await getDoc(donationsRef);
			if (docSnap.exists()) {
				const requestedDonation = docSnap.data().location;
				setDonorLoc(requestedDonation);
			} else {
				console.log("error");
			}
		} catch (error) {
			console.log(error);
		}
	};
	const handleAssign = async (
		riderId,
		riderName,
		riderPhone
	) => {
		try {
			setLoading(true);
			const status = "assigned";
			const donationsRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			const assignedTo = {
				name: riderName,
				phone: riderPhone,
				riderId,
			};
			const assignedBy = { orgId, orgName };
			const request = {
				assignedTo: assignedTo,
				assignedBy: assignedBy,
				status,
				createdAt: serverTimestamp(),
			};
			await updateDoc(donationsRef, request);
			alert("Assigned to rider");
			setLoading(false);
			navigation.navigate("Requests");
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
		}
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{donorLoc != null &&
				Object.keys(riders).length != 0 && (
					// <Text>{JSON.stringify(donorLoc, null, 4)}</Text>
					<NearestRiders
						donorloc={donorLoc}
						ridersloc={riders}
						handleAssign={handleAssign}
						loading={loading}
					/>
				)}
		</View>
	);
};

export default FindRiders;

const styles = StyleSheet.create({});
