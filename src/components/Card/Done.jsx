import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes } from "../../utils/theme";

const Done = ({ data }) => {
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
				<Card.Actions>
					<IconButton
						icon={"check-circle"}
						iconColor="white"
						mode="contained"
						containerColor={"green"}
						size={18}
					/>
				</Card.Actions>
			</Card>
		</View>
	);
};

export default Done;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
	},
});
