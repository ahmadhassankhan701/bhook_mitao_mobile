import { StyleSheet, View } from "react-native";
import React from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Sizes, colors } from "../../utils/theme";

const OrgLoc = ({ handleChange }) => {
	const initialRegion = {
		latitude: 31.4809172029034,
		longitude: 74.32941843381401,
		latitudeDelta: 0.01,
		longitudeDelta: 0.01,
	};
	return (
		<View>
			{/* <Text>{JSON.stringify(region, null, 4)}</Text> */}
			<View style={styles.mapContainer}>
				<GooglePlacesAutocomplete
					placeholder=" 🔍 Search Location"
					fetchDetails={true}
					GooglePlacesSearchQuery={{
						rankby: "distance",
					}}
					GooglePlacesDetailsQuery={{
						fields: ["formatted_address", "geometry"],
					}}
					textInputProps={{
						placeholderTextColor: "gray",
					}}
					onPress={(data, details = null) => {
						if (details == null) {
							return;
						}
						let city;
						for (
							let i = 0;
							i < details.address_components.length;
							i++
						) {
							for (
								let j = 0;
								j <
								details.address_components[i].types.length;
								j++
							) {
								switch (
									details.address_components[i].types[j]
								) {
									case "locality":
										city =
											details.address_components[i]
												.long_name;
										break;
								}
							}
						}
						const upperCaseCity = city?.toUpperCase();
						const address = details.formatted_address;
						const pos = {
							lat: details.geometry.location.lat,
							lng: details.geometry.location.lng,
						};
						handleChange(address, upperCaseCity, pos);
					}}
					query={{
						key: "AIzaSyCAukR_SsOKADb2N1YmOEyRwFGKWZTwmOo",
						language: "en",
						types: "establishment",
						radius: 8000,
						location: `${initialRegion?.latitude},${initialRegion?.longitude}`,
					}}
					styles={{
						container: {
							flex: 0,
							zIndex: 10,
							width: Sizes.width - 50,
						},
						textInput: {
							fontSize: 15,
							borderRadius: 50,
						},
						poweredContainer: {
							display: "none",
						},
						row: {
							marginVertical: 2,
							borderBottomColor: `${colors.primary}`,
							backgroundColor: "yellow",
							borderBottomWidth: 2,
						},
					}}
				/>
			</View>
		</View>
	);
};

export default OrgLoc;

const styles = StyleSheet.create({
	mapContainer: {
		marginVertical: 10,
		borderRadius: 50,
	},
});
