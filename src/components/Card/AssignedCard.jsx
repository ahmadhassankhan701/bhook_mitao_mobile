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

const AssignedCard = ({
	data,
	handleStart,
	handleDeny,
	completeDonation,
	denyloading,
}) => {
	const navigation = useNavigation();
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.detail.name}
					subtitle={"Donor Phone: 0" + data.detail.phone}
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
							<Text style={{ paddingHorizontal: 10 }}>
								{data.status}
							</Text>
						);
					}}
				/>
				<Card.Content style={{ paddingHorizontal: 25 }}>
					<Text variant="titleLarge">
						For Persons: {data.detail.quantity}
					</Text>
					<Text variant="bodyMedium">
						Desc: {data.detail.desc}
					</Text>
					<Text variant="bodyMedium">
						Address: {data.location.address}
					</Text>
				</Card.Content>
				<Card.Actions
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
					}}
				>
					{data.status == "pending" && (
						<>
							<Button
								mode="contained"
								buttonColor="green"
								textColor="white"
								onPress={() =>
									completeDonation(
										data.key,
										data.userId,
										data.selectedOrg.push_token,
										data.push_token
									)
								}
								icon={"check-circle"}
							>
								Confirm
							</Button>
							{data.done.donor && (
								<IconButton
									icon={"account"}
									iconColor="white"
									mode="contained"
									containerColor={"green"}
									size={18}
								/>
							)}
						</>
					)}
					{data.status == "assigned" && (
						<>
							<IconButton
								icon={"check-circle"}
								iconColor="white"
								mode="contained"
								containerColor={"green"}
								size={18}
								onPress={() =>
									handleStart(
										data.key,
										data.userId,
										data.selectedOrg.push_token,
										data.push_token
									)
								}
							/>
							<IconButton
								icon={
									denyloading ? "reload" : "close-circle"
								}
								iconColor="white"
								mode="contained"
								containerColor={"red"}
								size={18}
								disabled={denyloading}
								onPress={() =>
									handleDeny(
										data.key,
										data.userId,
										data.selectedOrg.push_token
									)
								}
							/>
						</>
					)}
					<IconButton
						icon={"eye"}
						iconColor="white"
						mode="contained"
						containerColor={"darkblue"}
						size={18}
						onPress={() =>
							navigation.navigate("Detail", {
								docId: data.key,
								userId: data.userId,
							})
						}
					/>
				</Card.Actions>
			</Card>
		</View>
	);
};

export default AssignedCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
		backgroundColor: colors.primary,
	},
});
