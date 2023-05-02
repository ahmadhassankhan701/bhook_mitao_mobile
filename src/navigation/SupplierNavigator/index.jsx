import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Supplier/Homepage";
import Requests from "../../screens/Protected/Supplier/Requests";
import Events from "../../screens/Protected/Supplier/Events";
import AddEvents from "../../screens/Protected/Supplier/AddEvents";
import EditEvents from "../../screens/Protected/Supplier/EditEvents";
import Riders from "../../screens/Protected/Supplier/Riders";
import Account from "../../screens/Protected/Supplier/Account";
import Reset from "../../screens/Protected/Supplier/Reset";
import AddRider from "../../screens/Protected/Supplier/AddRider";
import EditRider from "../../screens/Protected/Supplier/EditRider";
import Locate from "../../screens/Protected/Supplier/Locate";
import FindRiders from "../../screens/Protected/Supplier/FindRiders";

const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Homepage"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen name="Homepage" component={Homepage} />
			<Stack.Screen name="Requests" component={Requests} />
			<Stack.Screen name="Events" component={Events} />
			<Stack.Screen
				name="AddEvents"
				component={AddEvents}
			/>
			<Stack.Screen
				name="EditEvents"
				component={EditEvents}
			/>
			<Stack.Screen name="Riders" component={Riders} />
			<Stack.Screen name="Account" component={Account} />
			<Stack.Screen name="Reset" component={Reset} />
			<Stack.Screen name="AddRider" component={AddRider} />
			<Stack.Screen name="Locate" component={Locate} />
			<Stack.Screen
				name="FindRiders"
				component={FindRiders}
			/>
			<Stack.Screen
				name="EditRider"
				component={EditRider}
			/>
		</Stack.Navigator>
	);
};

export default index;

const styles = StyleSheet.create({});
