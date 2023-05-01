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

const RidersCard = ({ data, handleDelete }) => {
	const navigation = useNavigation();
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.name}
					subtitle={"0" + data.phone}
					left={() => {
						return (
							<Avatar.Image
								size={50}
								source={{
									uri:
										data.image == ""
											? `https://via.placeholder.com/200x200.png/ec851f/FFFFFF?text=${data.name[0]}`
											: data.image,
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
									iconColor="blue"
									size={20}
									containerColor="transparent"
									onPress={() =>
										navigation.navigate("EditRider", {
											riderId: data.riderId,
										})
									}
								/>
								<IconButton
									icon={"delete"}
									mode="contained"
									iconColor="red"
									containerColor="transparent"
									size={20}
									onPress={() => handleDelete(data.riderId)}
								/>
							</View>
						);
					}}
				/>
			</Card>
		</View>
	);
};

export default RidersCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
	},
});
