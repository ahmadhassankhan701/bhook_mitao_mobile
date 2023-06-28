import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Card,
	FAB,
	IconButton,
} from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const EventsCard = ({ data, handleDelete }) => {
	const { state } = useContext(AuthContext);
	const navigation = useNavigation();
	return (
		<View style={{ marginBottom: 20 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					style={{ color: "white" }}
					title={data.title}
					left={() => {
						return (
							<Avatar.Image
								size={50}
								source={{
									uri: `https://via.placeholder.com/200x200.png/000/fff?text=${state.user.name[0]}`,
								}}
							/>
						);
					}}
					right={() => {
						return (
							<View
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									flexDirection: "row",
								}}
							>
								<IconButton
									icon={"pencil"}
									mode="contained"
									iconColor="white"
									size={20}
									containerColor="lightgray"
									onPress={() =>
										navigation.navigate("EditEvents", {
											orgId: data.orgId,
											docId: data.key,
										})
									}
								/>
								<IconButton
									icon={"delete"}
									mode="contained"
									iconColor="white"
									containerColor="red"
									size={20}
									onPress={() =>
										handleDelete(
											data.orgId,
											data.key,
											data.filePath
										)
									}
								/>
							</View>
						);
					}}
					titleStyle={{ color: "#fff" }}
				/>
				<Card.Content>
					<Text style={{ color: "white" }}>
						{data.description}
					</Text>
					<Image
						source={{ uri: data.image }}
						width={300}
						height={100}
						alt="event"
						style={{ marginVertical: 10 }}
					/>
				</Card.Content>
			</Card>
		</View>
	);
};

export default EventsCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
		backgroundColor: colors.primary,
		color: "white",
		marginVertical: 10,
	},
});
