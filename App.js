import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Provider as PaperProvider } from "react-native-paper";
import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";
import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

Location.setGoogleApiKey(
	"AIzaSyCAukR_SsOKADb2N1YmOEyRwFGKWZTwmOo"
);
Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: false,
	}),
});
export default function App() {
	const [fontsLoaded] = useFonts({
		"Montserrat-Regular": require("./src/assets/fonts/Montserrat-Regular.ttf"),
		"Montserrat-Bold": require("./src/assets/fonts/Montserrat-Bold.ttf"),
		"Montserrat-SemiBold": require("./src/assets/fonts/Montserrat-SemiBold.ttf"),
	});
	if (!fontsLoaded) {
		return null;
	}

	return (
		<NavigationContainer>
			<AuthProvider>
				<PaperProvider>
					<Navigation />
				</PaperProvider>
			</AuthProvider>
		</NavigationContainer>
	);
}
