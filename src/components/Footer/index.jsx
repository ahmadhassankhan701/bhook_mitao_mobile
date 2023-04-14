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

	return (
		<TouchableOpacity onPress={handlePress}>
			<FontAwesome5
				name={name}
				size={25}
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

export default function index() {
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
					text="Homepage"
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
						navigation.navigate("Activity")
					}
					screenName="Activity"
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
