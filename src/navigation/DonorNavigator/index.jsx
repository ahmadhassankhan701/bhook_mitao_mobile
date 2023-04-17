import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Donor/Homepage";
import Activity from "../../screens/Protected/Donor/Activity";
import Account from "../../screens/Protected/Donor/Account";
import Donate from "../../screens/Protected/Donor/Donate";

const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<>
			<Stack.Navigator
				initialRouteName="Homepage"
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen
					name="Homepage"
					component={Homepage}
				/>
				<Stack.Screen
					name="Activity"
					component={Activity}
				/>
				<Stack.Screen name="Donate" component={Donate} />
				<Stack.Screen name="Account" component={Account} />
			</Stack.Navigator>
		</>
	);
};

export default index;

const styles = StyleSheet.create({});
