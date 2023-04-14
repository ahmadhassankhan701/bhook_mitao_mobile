import { StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { Sizes } from "../../utils/theme";

const Basic = ({ location }) => {
	const mapView = useRef();

	const initialRegion = {
		latitude: 31.4809172029034,
		longitude: 74.32941843381401,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	return (
		<View style={styles.mapContainer}>
			<MapView
				ref={mapView}
				initialRegion={initialRegion}
				region={{
					latitude: location.currentLocation.lat,
					longitude: location.currentLocation.lng,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				style={styles.map}
			>
				<Marker
					coordinate={{
						latitude: location.currentLocation.lat,
						longitude: location.currentLocation.lng,
					}}
				/>
			</MapView>
		</View>
	);
};

export default Basic;

const styles = StyleSheet.create({
	map: {
		width: Sizes.width - 25,
		height: 181,
		borderRadius: 30,
		marginVertical: 10,
	},
	mapContainer: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 20,
	},
});
