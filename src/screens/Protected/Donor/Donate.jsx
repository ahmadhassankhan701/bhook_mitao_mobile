import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DonorFooter from "../../../components/Footer/DonorFooter";
import Header from "../../../components/Header";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Sizes, colors } from "../../../utils/theme";
import {
	Avatar,
	Card,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import { TouchableOpacity } from "react-native";

const Donate = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem("bhook_auth");
			setState({ ...state, user: null });
			navigation.navigate("Intro");
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "space-between",
			}}
		>
			<Header showModal={showModal} />
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text style={{ textAlign: "center" }}>
							Are you sure you want to logout?
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
							}}
						>
							<IconButton
								icon={"check-circle"}
								iconColor="green"
								size={35}
								onPress={handleLogout}
							/>
							<IconButton
								icon={"close-circle"}
								iconColor="red"
								size={35}
								onPress={hideModal}
							/>
						</View>
					</View>
				</Modal>
			</Portal>
			<View style={styles.center}>
				<TouchableOpacity
					onPress={() => navigation.navigate("Food")}
				>
					<Card style={styles.card}>
						<Card.Content style={styles.center}>
							<Avatar.Icon
								color={"white"}
								style={{ backgroundColor: colors.primary }}
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
								style={{ backgroundColor: colors.primary }}
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
	},
	donate: {
		fontSize: 20,
		color: "gray",
		fontWeight: "600",
		marginVertical: "5%",
	},
});
