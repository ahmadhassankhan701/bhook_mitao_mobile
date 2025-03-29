import { StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Sizes } from "../../utils/theme";
import { Image } from "react-native";
import { getDistance } from "geolib";
import {
	Button,
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
const NearestRiders = ({
	donorloc,
	ridersloc,
	handleAssign,
	loading,
}) => {
	const [selected, setSelected] = useState({});
	const mapView = useRef();
	const [visible, setVisible] = useState(false);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: "white",
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
	const ht = 700;
	const initialRegion = {
		latitude: 31.4809172029034,
		longitude: 74.32941843381401,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	const handleDistance = async (
		riderLat,
		riderLng,
		riderName,
		riderPhone,
		riderId,
		push_token
	) => {
		var dis = getDistance(
			{ latitude: riderLat, longitude: riderLng },
			{
				latitude: donorloc.currentLocation.lat,
				longitude: donorloc.currentLocation.lng,
			}
		);
		const info = {
			distance: dis / 1000,
			time: dis / 40000,
			riderName,
			riderPhone,
			riderId,
			push_token,
		};
		setSelected(info);
		setVisible(true);
	};
	return (
		<View style={styles.mapContainer}>
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<Text style={{ textAlign: "center" }}>
							Distance: {selected.distance} KM
						</Text>
						<Text style={{ textAlign: "center" }}>
							Time: {(selected.time * 60).toFixed(2)} mins
						</Text>
						<Text style={{ textAlign: "center" }}>
							Rider: {selected.riderName}
						</Text>
						<Text style={{ textAlign: "center" }}>
							Rider Phone: 0{selected.riderPhone}
						</Text>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-around",
								alignItems: "center",
								marginVertical: 10,
							}}
						>
							<Button
								icon={"check-circle"}
								mode="contained"
								buttonColor="green"
								onPress={() =>
									handleAssign(
										selected.riderId,
										selected.riderName,
										selected.riderPhone,
										selected.push_token
									)
								}
								loading={loading}
								disabled={loading}
							>
								Assign
							</Button>
							<Button
								icon={"close-circle"}
								mode="contained"
								buttonColor="red"
								onPress={hideModal}
							>
								Cancel
							</Button>
						</View>
					</View>
				</Modal>
			</Portal>
			<MapView
				ref={mapView}
				initialRegion={initialRegion}
				region={{
					latitude: donorloc.currentLocation.lat,
					longitude: donorloc.currentLocation.lng,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01,
				}}
				style={[styles.map, { height: ht }]}
			>
				<Marker
					coordinate={{
						latitude: donorloc.currentLocation.lat,
						longitude: donorloc.currentLocation.lng,
					}}
				>
					<Image
						source={require("../../assets/pin.png")}
						style={{
							height: 30,
							width: 30,
							resizeMode: "contain",
						}}
					/>
				</Marker>
				{ridersloc.map((riderloc) => (
					<Marker
						coordinate={{
							latitude:
								riderloc.location.currentLocation.lat,
							longitude:
								riderloc.location.currentLocation.lng,
						}}
						key={riderloc.key}
						onPress={() =>
							handleDistance(
								riderloc.location.currentLocation.lat,
								riderloc.location.currentLocation.lng,
								riderloc.name,
								riderloc.phone,
								riderloc.riderId,
								riderloc.push_token
							)
						}
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
				))}
			</MapView>
		</View>
	);
};

export default NearestRiders;

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
	},
});
