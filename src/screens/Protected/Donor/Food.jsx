import { StyleSheet, Text, View } from "react-native";
import React from "react";
import FoodForm from "../../../components/Form/FoodForm";

const Food = () => {
	return (
		<View style={styles.top}>
			<View>
				<FoodForm />
			</View>
		</View>
	);
};

export default Food;

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
