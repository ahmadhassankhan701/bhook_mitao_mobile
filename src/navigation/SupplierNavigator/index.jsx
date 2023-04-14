import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../../screens/Protected/Supplier/Homepage";
import { IconButton } from "react-native-paper";
import { colors } from "../../utils/theme";

const Stack = createNativeStackNavigator();

const index = () => {
	return (
		<Stack.Navigator
			initialRouteName="Homepage"
			screenOptions={{ headerShown: false }}
		>
			<Stack.Screen
				name="Homepage"
				component={Homepage}
				options={({ navigation, route }) => ({
					headerShown: true,
					headerTitle: "",
					headerTransparent: false,
					headerRight: () => (
						<IconButton
							icon="logout"
							iconColor={colors.primary}
							size={30}
							onPress={() => {}}
						/>
					),
				})}
			/>
		</Stack.Navigator>
	);
};

export default index;

const styles = StyleSheet.create({});
