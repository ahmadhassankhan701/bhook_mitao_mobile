import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Donor/Homepage";
import Activity from "../../screens/Protected/Donor/Activity";
import Account from "../../screens/Protected/Donor/Account";
import Donate from "../../screens/Protected/Donor/Donate";
import Reset from "../../screens/Protected/Donor/Reset";
import Food from "../../screens/Protected/Donor/Food";
import EditFood from "../../screens/Protected/Donor/EditFood/EditFood";
import Money from "../../screens/Protected/Donor/Money";
import FoodFinal from "../../screens/Protected/Donor/FoodFinal";
import TrackRider from "../../screens/Protected/Donor/TrackRider";
import FoodFinalOrg from "../../screens/Protected/Donor/FoodFinalOrg";

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
				<Stack.Screen name="Reset" component={Reset} />
				<Stack.Screen name="Food" component={Food} />
				<Stack.Screen
					name="EditFood"
					component={EditFood}
				/>
				<Stack.Screen name="Money" component={Money} />
				<Stack.Screen
					name="TrackRider"
					component={TrackRider}
				/>
				<Stack.Screen
					name="FoodFinal"
					component={FoodFinal}
				/>
				<Stack.Screen
					name="FoodFinalOrg"
					component={FoodFinalOrg}
				/>
			</Stack.Navigator>
		</>
	);
};

export default index;

const styles = StyleSheet.create({});
