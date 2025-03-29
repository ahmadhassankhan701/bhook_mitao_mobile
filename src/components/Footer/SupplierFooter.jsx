import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
	useNavigation,
	useRoute,
} from "@react-navigation/native";

export const Tab = ({
	name,
	text,
	handlePress,
	screenName,
	routeName,
}) => {
	const activeScreenBgColor =
		screenName === routeName ? "#6F7378" : "transparent";
	const activeTopMargin =
		screenName === routeName ? -25 : 0;
	const activePadding = screenName === routeName ? 12 : 0;
	const activeBorderWidth =
		screenName === routeName ? 3 : 0;

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					alignSelf: "center",
					borderRadius: 50,
					padding: activePadding,
					marginTop: activeTopMargin,
					borderWidth: activeBorderWidth,
					borderColor: "#000000",
					backgroundColor: activeScreenBgColor,
				}}
			>
				<FontAwesome5
					name={name}
					size={20}
					color={"#fff"}
				/>
			</View>
			<Text
				style={{
					color: "#fff",
					alignSelf: "center",
					fontFamily: "Montserrat-Regular",
					fontSize: 12,
					lineHeight: 16,
				}}
			>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default function SupplierFooter() {
	const navigation = useNavigation();
	const route = useRoute();

	return (
		<View
			style={{
				backgroundColor: "#6F7378",
				paddingVertical: 30,
				borderTopEndRadius: 24,
				borderTopStartRadius: 24,
			}}
		>
			<View
				style={{
					flexDirection: "row",
					paddingVertical: 10,
					justifyContent: "space-around",
					backgroundColor: "#000000",
				}}
			>
				<Tab
					text="Home"
					name="home"
					handlePress={() =>
						navigation.navigate("Homepage")
					}
					screenName="Homepage"
					routeName={route.name}
				/>
				<Tab
					text="Activity"
					name="tasks"
					handlePress={() =>
						navigation.navigate("Requests")
					}
					screenName="Requests"
					routeName={route.name}
				/>
				<Tab
					text="Events"
					name="calendar-alt"
					handlePress={() => navigation.navigate("Events")}
					screenName="Events"
					routeName={route.name}
				/>
				<Tab
					text="Riders"
					name="biking"
					handlePress={() => navigation.navigate("Riders")}
					screenName="Riders"
					routeName={route.name}
				/>
				<Tab
					text="Account"
					name="user"
					handlePress={() => navigation.navigate("Account")}
					screenName="Account"
					routeName={route.name}
				/>
			</View>
		</View>
	);
}
