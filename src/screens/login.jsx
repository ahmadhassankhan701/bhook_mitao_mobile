import { StyleSheet, Text, View } from "react-native";
import React from "react";
import RiderAuth from "../components/Form/RiderAuth";
import { Sizes, colors } from "../utils/theme";
import { Avatar } from "react-native-paper";

const Login = ({ navigation, route }) => {
	const { categ } = route.params;
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{categ == "donor" ? (
				<Text>Login donor</Text>
			) : categ == "supplier" ? (
				<Text>Login supplier</Text>
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
