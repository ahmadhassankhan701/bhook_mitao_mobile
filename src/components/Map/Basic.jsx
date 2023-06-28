import { StyleSheet, View } from "react-native";
import React, { useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { Sizes } from "../../utils/theme";
import { Image } from "react-native";

const Basic = ({ location, markerImg, height }) => {
	const mapView = useRef();
	const ht = height || 181;
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
				style={[styles.map, { height: ht }]}
			>
				<Marker
					coordinate={{
						latitude: location.currentLocation.lat,
						longitude: location.currentLocation.lng,
					}}
				>
					{markerImg == "pin" ? (
						<Image
							source={require("../../assets/pin.png")}
							style={{
								height: 30,
								width: 30,
								resizeMode: "contain",
							}}
						/>
					) : (
						<Image
							source={require("../../assets/rider.png")}
							style={{
								height: 30,
								width: 30,
								resizeMode: "contain",
							}}
						/>
					)}
				</Marker>
			</MapView>
		</View>
	);
};

export default Basic;

const styles = StyleSheet.create({
	map: {
		width: Sizes.width - 25,
		borderRadius: 30,
		marginVertical: 10,
	},
});
