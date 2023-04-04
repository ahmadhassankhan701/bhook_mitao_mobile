import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
// import { AuthProvider } from "./context/auth";
import { useFonts } from "expo-font";
import AppNavigator from "./src/navigation/AppNavigator/index";
import AuthNavigator from "./src/navigation/AuthNavigator/index";
import { Provider as PaperProvider } from "react-native-paper";
export default function App() {
	const [fontsLoaded] = useFonts({
		"Montserrat-Regular": require("./src/assets/fonts/Montserrat-Regular.ttf"),
		"Montserrat-Bold": require("./src/assets/fonts/Montserrat-Bold.ttf"),
		"Montserrat-SemiBold": require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
	});
	if (!fontsLoaded) {
		return null;
	}
	const authed = false;
	return (
		<NavigationContainer>
			{/* <AuthProvider> */}
			<PaperProvider>
				{authed ? <AppNavigator /> : <AuthNavigator />}
			</PaperProvider>
			{/* </AuthProvider> */}
		</NavigationContainer>
	);
}
