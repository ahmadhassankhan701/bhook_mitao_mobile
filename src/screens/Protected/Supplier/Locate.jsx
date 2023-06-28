import { View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../../utils/theme";
import { ActivityIndicator } from "react-native-paper";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Basic from "../../../components/Map/Basic";
import RequestCard from "../../../components/Card/RequestCard";
import { Text } from "react-native";

const Locate = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const { docId, userId } = route.params;
	const [donation, setDonation] = useState({});
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		docId && userId && getRequest();
	}, [docId && userId]);
	const getRequest = async () => {
		try {
			setLoading(true);
			const docRef = doc(
				db,
				`Donations/${userId}/food`,
				docId
			);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				const reqDonation = {
					key: docSnap.id,
					...docSnap.data(),
				};
				setDonation(reqDonation);
			} else {
				alert("No such document!");
				console.log(error);
				navigation.navigate("Requests");
			}
			setLoading(false);
		} catch (error) {
			alert("Something went wrong");
			console.log(error);
			navigation.navigate("Requests");
		}
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#000",
			}}
		>
			{/* <Text>{JSON.stringify(donation, null, 4)}</Text> */}
			<View>
				{loading ? (
					<ActivityIndicator
						style={{ paddingTop: 50 }}
						size={50}
						animating={loading}
						color={colors.primary}
					/>
				) : Object.keys(donation).length !== 0 ? (
					<View style={styles.center}>
						{/* <Text>{JSON.stringify(donation, null, 4)}</Text> */}
						<View>
							<RequestCard
								data={donation}
								mode="findRiders"
							/>
							<Basic
								location={donation.location}
								markerImg={"pin"}
								height={181}
							/>
						</View>
					</View>
				) : (
					<Text>No data Available</Text>
				)}
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default Locate;
