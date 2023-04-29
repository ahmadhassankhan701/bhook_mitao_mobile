import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import FoodEditForm from "../../../../components/Form/FoodEditForm";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";

const EditFood = ({ route, navigation }) => {
	const { userId, docId } = route.params;
	const [data, setData] = useState(null);
	useEffect(() => {
		getDonation(userId, docId);
	}, [userId && docId]);
	const getDonation = async (userId, docId) => {
		try {
			const docRef = doc(
				db,
				`Donations/${userId}/food`,
				`${docId}`
			);
			const docSnap = await getDoc(docRef);
			if (docSnap.exists()) {
				setData(docSnap.data());
			} else {
				// doc.data() will be undefined in this case
				alert("No such document!");
				navigation.navigate("Activity");
			}
		} catch (error) {
			console.log(error);
			navigation.navigate("Activity");
		}
	};
	return (
		<View style={styles.top}>
			<View>
				{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
				{data && (
					<FoodEditForm
						data={data}
						userId={userId}
						docId={docId}
					/>
				)}
			</View>
		</View>
	);
};

export default EditFood;

const styles = StyleSheet.create({
	top: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
});
