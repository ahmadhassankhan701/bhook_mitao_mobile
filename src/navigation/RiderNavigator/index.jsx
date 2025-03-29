import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Rider/Homepage";
import Activity from "../../screens/Protected/Rider/Activity";
import Account from "../../screens/Protected/Rider/Account";
import Detail from "../../screens/Protected/Rider/Detail";

const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Homepage"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Homepage" component={Homepage} />
			<Stack.Screen name="Activity" component={Activity} />
			<Stack.Screen name="Account" component={Account} />
			<Stack.Screen name="Detail" component={Detail} />
		</Stack.Navigator>
	);
};

export default index;

const styles = StyleSheet.create({});
