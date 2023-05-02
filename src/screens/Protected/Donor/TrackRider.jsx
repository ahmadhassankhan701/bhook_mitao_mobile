import { Image, StyleSheet, View } from "react-native";
import React, {
	useContext,
	useEffect,
	useRef,
} from "react";
import { useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../firebase";
import haversine from "haversine-distance";
import MapView, { MarkerAnimated } from "react-native-maps";
import { Sizes } from "../../../utils/theme";
import { AuthContext } from "../../../context/AuthContext";
const TrackRider = ({ route }) => {
	const { state } = useContext(AuthContext);
	const userId = state && state.user && state.user.userId;
	const { riderId, donorLat, donorLng } = route.params;
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
					// checkNotify(loc.currentLocation.lat, loc.currentLocation.lng)
				}
			});
		} catch (error) {
			console.log(error);
		}
	};
	// const checkNotify = async (riderLat, riderLng) => {
	// 	let distance = haversine({ latitude: donorLat, longitude: donorLng }, { latitude: riderLat, longitude: riderLng })

	// 	if (distance < 100) {
	// 		sendPDNotification(userId, "Pickup Location", "Rider is near to pickup location")
	// 	}
	// }
	// const sendPDNotification = async (parent, title, body) => {

	// 	const q = query(collection(db, "notification"), where("user", "==", parent));
	// 	const querySnapshot = await getDocs(q);
	// 	querySnapshot.forEach((doc) => {
	// 	  sendNotification(doc.data()?.token, title, body)
	// 	});

	// }
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
		width: Sizes.width - 25,
		borderRadius: 30,
		marginVertical: 10,
	},
	mapContainer: {
		borderColor: "lightgray",
		borderWidth: 1,
		borderRadius: 20,
	},
});
