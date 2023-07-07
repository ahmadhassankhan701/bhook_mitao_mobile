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
import { useState } from "react";
import Confirm from "../Modal/Confirm";
const DonorActivity = ({
	data,
	handleDelete,
	completeDonation,
	completeLoading,
}) => {
	const navigation = useNavigation();
	const [deleteVisible, setDeleteVisible] = useState(false);
	const [completeVisible, setCompleteVisible] =
		useState(false);
	const handleModalDelete = async () => {
		setDeleteVisible(false);
		handleDelete(
			data.userId,
			data.key,
			data.selectedOrg.push_token
		);
	};
	const handleModalComplete = async () => {
		setCompleteVisible(false);
		completeDonation(
			data.userId,
			data.key,
			data.selectedOrg.push_token,
			data.selectedRider.push_token
		);
	};
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
			<Confirm
				visible={deleteVisible}
				setVisible={setDeleteVisible}
				title={"Are you sure?"}
				subtitle={"This action cannot be undone"}
				icon={"delete"}
				handleAction={handleModalDelete}
			/>
			<Confirm
				visible={completeVisible}
				setVisible={setCompleteVisible}
				title={"Are you sure?"}
				subtitle={"This means confirmation from your side"}
				icon={"alert"}
				handleAction={handleModalComplete}
			/>
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
								Rider Name: {data.selectedRider.name}
							</Text>
							<Text style={{ color: "#fff" }}>
								Rider Phone: 0{data.selectedRider.phone}
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
								onPress={() => setDeleteVisible(true)}
							/>
							<IconButton
								icon={"delete"}
								mode="contained"
								iconColor="white"
								containerColor="red"
								size={20}
								onPress={() => setDeleteVisible(true)}
							/>
						</>
					) : data.status == "started" ? (
						<>
							<Button
								mode="contained"
								buttonColor="green"
								textColor="white"
								onPress={() => setCompleteVisible(true)}
								icon={"check-circle"}
								loading={completeLoading}
							>
								Confirm
							</Button>
							<IconButton
								icon={"map-marker-radius"}
								mode="contained"
								iconColor="white"
								containerColor={"blue"}
								size={20}
								onPress={() =>
									navigation.navigate("TrackRider", {
										riderId: data.selectedRider.riderId,
										donorLat:
											data.location.currentLocation.lat,
										donorLng:
											data.location.currentLocation.lng,
									})
								}
							/>
						</>
					) : data.status == "assigned" ? (
						<Text style={{ color: "#ffffff" }}>
							Rider Approval Pending
						</Text>
					) : (
						<IconButton
							icon={"account-check"}
							iconColor="white"
							mode="contained"
							containerColor={"green"}
							size={18}
						/>
					)}

					{data.done && data.done.rider == true && (
						<IconButton
							icon={"racing-helmet"}
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
