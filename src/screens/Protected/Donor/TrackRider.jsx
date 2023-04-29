import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useState } from "react";
import LiveRider from "../../../components/Map/LiveRider";
const TrackRider = ({ route }) => {
	const { uid, docId } = route.params;
	const [riderLocation, setRiderLocation] = useState({
		currentLocation: {
			lat: 31.4809172029034,
			lng: 74.32941843381401,
		},
	});
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<LiveRider riderLocation={riderLocation} />
		</View>
	);
};

export default TrackRider;

const styles = StyleSheet.create({});
