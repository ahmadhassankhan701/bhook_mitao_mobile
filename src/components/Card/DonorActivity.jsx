import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Button,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";

const DonorActivity = ({
	data,
	handleDelete,
	loading,
	completeDonation,
	completeLoading,
}) => {
	const navigation = useNavigation();
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.detail.name}
					subtitle={"0" + data.detail.phone}
					left={() => {
						return (
							<Avatar.Text
								size={50}
								label={data.detail.name[0]}
							/>
						);
					}}
					right={() => {
						return (
							<Text
								style={{
									paddingHorizontal: 10,
									color: "#fff",
								}}
							>
								{data.status}
							</Text>
						);
					}}
					titleStyle={{ color: "white" }}
					subtitleStyle={{ color: "white" }}
				/>
				<Card.Content style={{ paddingHorizontal: 25 }}>
					<Text style={{ color: "#fff" }}>
						Desc: {data.detail.desc}
					</Text>
					<Text style={{ color: "#fff" }}>
						For Persons: {data.detail.quantity}
					</Text>
					<Text style={{ color: "#fff" }}>
						Address: {data.location.address}
					</Text>
					{data.status == "started" && (
						<>
							<Text style={{ color: "#fff" }}>
								Rider Name: {data.assignedTo.name}
							</Text>
							<Text style={{ color: "#fff" }}>
								Rider Phone: 0{data.assignedTo.phone}
							</Text>
						</>
					)}
				</Card.Content>
				<Card.Actions>
					{data.status == "requested" ? (
						<>
							<IconButton
								icon={"delete"}
								mode="contained"
								iconColor="white"
								containerColor="red"
								size={20}
								onPress={() =>
									handleDelete(data.userId, data.key)
								}
							/>
						</>
					) : data.status == "started" ? (
						<IconButton
							icon={"map-marker-radius"}
							mode="contained"
							iconColor="white"
							containerColor={"blue"}
							size={20}
							onPress={() =>
								navigation.navigate("TrackRider", {
									riderId: data.assignedTo.riderId,
									donorLat:
										data.location.currentLocation.lat,
									donorLng:
										data.location.currentLocation.lng,
								})
							}
						/>
					) : data.status == "assigned" ? (
						<Text style={{ color: "#ffffff" }}>
							Waiting for rider
						</Text>
					) : (
						<IconButton
							icon={"racing-helmet"}
							iconColor="white"
							mode="contained"
							containerColor={"green"}
							size={18}
						/>
					)}
					{data.done &&
						data.done.rider == true &&
						data.done.donor == false && (
							<Button
								mode="contained"
								buttonColor="green"
								textColor="white"
								onPress={() =>
									completeDonation(data.userId, data.key)
								}
								icon={"check-circle"}
								disabled={completeLoading}
								loading={completeLoading}
							>
								Confirm
							</Button>
						)}
					{data.done && data.done.donor == true && (
						<IconButton
							icon={"account-check"}
							iconColor="white"
							mode="contained"
							containerColor={"green"}
							size={18}
						/>
					)}
				</Card.Actions>
			</Card>
		</View>
	);
};

export default DonorActivity;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
		backgroundColor: colors.primary,
		color: "white",
		marginVertical: 5,
	},
});
