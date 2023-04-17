import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes } from "../../utils/theme";

const Done = ({ data, by }) => {
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(lastDoc, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={data.name}
					subtitle={"0" + data.data.phone}
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
					<Text>{data.data.detail}</Text>
					<Text>{data.data.quantity}</Text>
					<Text>{data.location.address}</Text>
					{by == "donor" && (
						<>
							<Text>
								Rider Name: {data.assignedTo.name}
							</Text>
							<Text>
								Rider Phone: 0{data.assignedTo.phone}
							</Text>
						</>
					)}
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
