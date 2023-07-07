import { Image, StyleSheet, View } from "react-native";
import React, { useEffect, useRef } from "react";
import { styling } from "../../../utils/Helpers/MapStyles";
import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import MapView, { MarkerAnimated } from "react-native-maps";
import { Sizes } from "../../../utils/theme";
const TrackRider = ({ route }) => {
	const { riderId } = route.params;
	const [riderLocation, setRiderLocation] = useState({
		currentLocation: {
			lat: 31.4809172029034,
			lng: 74.32941843381401,
		},
	});
	const mapView = useRef();
	const initialRegion = {
		latitude: 31.4809172029034,
		longitude: 74.32941843381401,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	useEffect(() => {
		riderId && getRiderLocation();
	}, [riderId]);
	const getRiderLocation = async () => {
		try {
			const docRef = doc(db, `Riders`, `${riderId}`);
			onSnapshot(docRef, (doc) => {
				if (doc.exists()) {
					const loc = doc.data().location;
					setRiderLocation(loc);
					if (mapView.current) {
						mapView.current.animateMarkerToCoordinate(
							{
								latitude: loc.currentLocation.lat,
								longitude: loc.currentLocation.lng,
							},
							1000
						);
					}
				}
			});
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<View style={styles.mapContainer}>
				<MapView
					// ref={mapView}
					initialRegion={initialRegion}
					region={{
						latitude: riderLocation.currentLocation.lat,
						longitude: riderLocation.currentLocation.lng,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
					style={[styles.map, { height: 700 }]}
					customMapStyle={styling}
				>
					<MarkerAnimated
						ref={mapView}
						coordinate={{
							latitude: riderLocation.currentLocation.lat,
							longitude: riderLocation.currentLocation.lng,
						}}
					>
						<Image
							source={require("../../../assets/rider.png")}
							style={{
								height: 30,
								width: 30,
								resizeMode: "contain",
							}}
						/>
					</MarkerAnimated>
				</MapView>
			</View>
		</View>
	);
};

export default TrackRider;

const styles = StyleSheet.create({
	map: {
		width: Sizes.width,
		borderRadius: 30,
		marginVertical: 10,
	},
	mapContainer: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 20,
		marginVertical: 10,
	},
});
