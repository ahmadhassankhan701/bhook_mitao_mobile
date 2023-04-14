import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Donor/Homepage";

const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Homepage"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Homepage" component={Homepage} />
		</Stack.Navigator>
	);
};

export default index;

const styles = StyleSheet.create({});
