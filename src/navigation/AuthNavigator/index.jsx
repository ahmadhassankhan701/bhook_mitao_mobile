import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Intro from "../../screens/Intro";
import Login from "../../screens/login";
const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Intro"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="Intro"
				component={Intro}
				options={() => ({
					headerShown: false,
				})}
			/>
			<Stack.Screen
				name="login"
				component={Login}
				options={() => ({
					headerShown: false,
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;

const styles = StyleSheet.create({});
