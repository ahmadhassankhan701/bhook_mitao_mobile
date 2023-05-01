import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import { Divider } from "react-native-elements";

export const Tab = ({
	name,
	text,
	handlePress,
	screenName,
	routeName,
}) => {
	const activeScreenColor =
		screenName === routeName && "orange";
	const activeMarginBottom =
		screenName === routeName ? 0 : 0;

	return (
		<TouchableOpacity
			onPress={handlePress}
			style={{ marginTop: activeMarginBottom }}
		>
			<FontAwesome5
				name={name}
				size={20}
				style={{
					marginBottom: 3,
					alignSelf: "center",
				}}
				color={activeScreenColor}
			/>
			<Text style={{ color: activeScreenColor }}>
				{text}
			</Text>
		</TouchableOpacity>
	);
};

export default function SupplierFooter() {
	const navigation = useNavigation();
	const route = useRoute();

	return (
		<View>
			<Divider width={1} />
			<View
				style={{
					flexDirection: "row",
					margin: 10,
					marginHorizontal: 30,
					justifyContent: "space-between",
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
					text="Requests"
					name="tasks"
					handlePress={() =>
						navigation.navigate("Requests")
					}
					screenName="Activity"
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
