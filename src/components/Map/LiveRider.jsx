import { StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { Sizes } from "../../utils/theme";
import { Image } from "react-native";

const LiveRider = ({ riderLocation }) => {
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
					latitude: riderLocation.currentLocation.lat,
					longitude: riderLocation.currentLocation.lng,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				style={styles.map}
			>
				<Marker
					coordinate={{
						latitude: riderLocation.currentLocation.lat,
						longitude: riderLocation.currentLocation.lng,
					}}
				>
					<Image
						source={require("../../assets/rider.png")}
						style={{
							height: 30,
							width: 30,
							resizeMode: "contain",
						}}
					/>
				</Marker>
			</MapView>
		</View>
	);
};

export default LiveRider;

const styles = StyleSheet.create({
	map: {
		width: Sizes.width - 25,
		height: 500,
		borderRadius: 30,
		marginVertical: 10,
	},
	mapContainer: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 20,
	},
});
