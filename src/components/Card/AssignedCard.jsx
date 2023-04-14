import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Button,
	Card,
	FAB,
	IconButton,
} from "react-native-paper";
import { Sizes } from "../../utils/theme";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";

const AssignedCard = ({ data, navigation }) => {
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.name}
					subtitle={data.data.phone}
					left={() => {
						return (
							<Avatar.Text size={50} label={data.name[0]} />
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
						{data.data.detail}
					</Text>
					<Text variant="bodyMedium">
						{data.data.quantity}
					</Text>
					<Text variant="bodyMedium">
						{data.location.address}
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
					{data.status == "Started" ? (
						<>
							<IconButton
								icon={"check-circle"}
								iconColor="white"
								mode="contained"
								containerColor={"green"}
								size={18}
							/>
						</>
					) : data.status == "pending" ? (
						<>
							{data.done.donor && (
								<IconButton
									icon={"account"}
									iconColor="white"
									mode="contained"
									containerColor={"green"}
									size={18}
								/>
							)}
							{data.done.rider && (
								<IconButton
									icon={"racing-helmet"}
									iconColor="white"
									mode="contained"
									containerColor={"green"}
									size={18}
								/>
							)}
						</>
					) : (
						<>
							<IconButton
								icon={"check-circle"}
								iconColor="white"
								mode="contained"
								containerColor={"green"}
								size={18}
							/>
							<IconButton
								icon={"close-circle"}
								iconColor="white"
								mode="contained"
								containerColor={"red"}
								size={18}
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
	},
});
