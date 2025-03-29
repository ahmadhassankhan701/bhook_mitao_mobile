import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DonorFooter from "../../../components/Footer/DonorFooter";
import { Sizes, colors } from "../../../utils/theme";
import { Avatar, Card } from "react-native-paper";
import { TouchableOpacity } from "react-native";

const Donate = ({ navigation }) => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-between",
				backgroundColor: "#000",
			}}
		>
			<View style={[styles.center, { marginTop: 50 }]}>
				<TouchableOpacity
					onPress={() => navigation.navigate("Food")}
				>
					<Card style={styles.card}>
						<Card.Content style={styles.center}>
							<Avatar.Icon
								color={"white"}
								style={{ backgroundColor: "#000" }}
								icon={"charity"}
								size={100}
							/>
							<Text style={styles.donate}>Donate Food</Text>
						</Card.Content>
					</Card>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => navigation.navigate("Money")}
				>
					<Card style={styles.card}>
						<Card.Content style={styles.center}>
							<Avatar.Icon
								color={"white"}
								style={{ backgroundColor: "#000" }}
								icon={"cash"}
								size={100}
							/>
							<Text style={styles.donate}>
								Donate Money
							</Text>
						</Card.Content>
					</Card>
				</TouchableOpacity>
			</View>
			<DonorFooter />
		</View>
	);
};

export default Donate;

const styles = StyleSheet.create({
	center: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	card: {
		width: Sizes.width - 40,
		marginVertical: "5%",
		backgroundColor: colors.primary,
	},
	donate: {
		fontSize: 20,
		color: "white",
		fontWeight: "600",
		marginVertical: "5%",
	},
});
