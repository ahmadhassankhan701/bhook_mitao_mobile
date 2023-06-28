import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RiderAuth from "../components/Form/RiderAuth";
import { Sizes, colors } from "../utils/theme";
import { Avatar } from "react-native-paper";
import DonorAuth from "../components/Form/DonorAuth";
import SupplierAuth from "../components/Form/SupplierAuth";

const Login = ({ navigation, route }) => {
	const { categ } = route.params;
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "#000",
			}}
		>
			{categ == "donor" ? (
				<>
					<Avatar.Image
						size={120}
						source={require("../assets/donorLogo.jpg")}
						style={{ marginTop: 30 }}
					/>
					<Text
						style={{
							color: colors.desc,
							fontSize: Sizes.h2,
							marginVertical: 10,
							fontWeight: "600",
						}}
					>
						Donor Login
					</Text>
					<DonorAuth />
				</>
			) : categ == "supplier" ? (
				<>
					<Avatar.Image
						size={120}
						source={require("../assets/org.jpg")}
						style={{ marginTop: 30 }}
					/>
					<Text
						style={{
							color: colors.desc,
							fontSize: Sizes.h2,
							marginVertical: 10,
							fontWeight: "600",
						}}
					>
						Organization Login
					</Text>
					<SupplierAuth />
				</>
			) : (
				<>
					<Avatar.Image
						size={150}
						source={require("../assets/helmetLogo.jpg")}
						style={{ marginVertical: 30 }}
					/>
					<Text
						style={{
							color: colors.desc,
							fontSize: Sizes.h2,
							marginVertical: 10,
							fontWeight: "600",
						}}
					>
						Rider Login
					</Text>
					<RiderAuth />
				</>
			)}
		</View>
	);
};

export default Login;

const styles = StyleSheet.create({});
