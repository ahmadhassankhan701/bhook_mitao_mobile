import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
	Avatar,
	Card,
	IconButton,
} from "react-native-paper";
import { Sizes } from "../../utils/theme";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const MoneyDone = ({ data }) => {
	const { state } = useContext(AuthContext);
	return (
		<View style={{ marginVertical: 5 }}>
			{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
			<Card style={styles.card}>
				<Card.Title
					title={state && state.user && state.user.name}
					subtitle={"Email: " + data.receipt_email}
					left={() => {
						return (
							<Avatar.Text
								size={50}
								label={
									state && state.user && state.user.name[0]
								}
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
					<Text>{data.amount}</Text>
					<Text>Currency: usd</Text>
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

export default MoneyDone;

const styles = StyleSheet.create({
	card: {
		borderRadius: 12,
		width: Sizes.width - 25,
		padding: 2,
	},
});
