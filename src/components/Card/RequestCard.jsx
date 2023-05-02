import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Button,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";
import moment from "moment/moment";
import { useNavigation } from "@react-navigation/native";

const RequestCard = ({ data, mode }) => {
	const navigation = useNavigation();
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.detail.name}
					subtitle={"Role: " + data.identity?.toUpperCase()}
					left={() => {
						return (
							<Avatar.Text
								size={50}
								label={data.detail.name[0]?.toUpperCase()}
								color={"white"}
								style={{ backgroundColor: colors.primary }}
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
					<Text>For Persons: {data.detail.quantity}</Text>
					<Text>Desc: {data.detail.desc}</Text>
					<Text>Address: {data.location.address}</Text>
					<Text>Phone: 0{data.detail.phone}</Text>
				</Card.Content>
				<Card.Actions>
					<Button
						icon={"account-arrow-right"}
						mode="contained"
						buttonColor={colors.primary}
						onPress={
							mode === "findRiders"
								? () =>
										navigation.navigate("FindRiders", {
											docId: data.key,
											userId: data.userId,
										})
								: () =>
										navigation.navigate("Locate", {
											docId: data.key,
											userId: data.userId,
										})
						}
					>
						{mode === "findRiders"
							? "Find Riders"
							: "Assign"}
					</Button>
					<Text>
						{moment(
							data.createdAt.seconds * 1000
						).fromNow()}
					</Text>
				</Card.Actions>
			</Card>
		</View>
	);
};

export default RequestCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
	},
});
