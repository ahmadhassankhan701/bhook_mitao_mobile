import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes } from "../../utils/theme";

const DetailCard = ({ userData, docData, location }) => {
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={userData.name}
					subtitle={"+92-" + docData.phone}
					left={() => {
						return (
							<Avatar.Image
								size={50}
								source={{
									uri:
										userData.image == ""
											? `https://via.placeholder.com/200x200.png/ec851f/FFFFFF?text=${userData.name[0]}`
											: userData.image,
								}}
							/>
						);
					}}
					right={() => {
						return (
							<Text style={{ paddingHorizontal: 10 }}>
								{docData.donationType}
							</Text>
						);
					}}
				/>
				<Card.Content style={{ paddingHorizontal: 25 }}>
					<Text variant="titleLarge">{userData.email}</Text>
					<Text variant="bodyMedium">
						{location.address}
					</Text>
				</Card.Content>
			</Card>
		</View>
	);
};

export default DetailCard;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
	},
});
