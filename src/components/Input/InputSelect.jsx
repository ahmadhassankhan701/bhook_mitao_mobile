import { StyleSheet, Text, View } from "react-native";
import {
	IconButton,
	Provider,
	RadioButton,
} from "react-native-paper";
import React, { useState } from "react";
import { Sizes } from "../../utils/theme";
import { TouchableOpacity } from "react-native";
const InputSelect = ({ identity, setIdentity }) => {
	const [visible, setVisible] = useState(false);
	return (
		<View style={styles.selectCover}>
			<TouchableOpacity onPress={() => setVisible(true)}>
				<View
					colorScheme="dark"
					style={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						borderRadius: 50,
						paddingHorizontal: 20,
						backgroundColor: "white",
					}}
				>
					<Text
						style={{
							fontSize: 15,
							fontWeight: "600",
						}}
					>
						{identity == "" ? "Identity" : identity}
					</Text>
					<IconButton
						icon={"chevron-down"}
						iconColor="#A9A9A9"
					/>
				</View>
			</TouchableOpacity>
			{visible && (
				<View style={styles.identity}>
					<RadioButton.Group
						onValueChange={(value) => {
							setIdentity(value);
							setVisible(false);
						}}
						value={identity}
					>
						<RadioButton.Item label="Hotel" value="hotel" />
						<RadioButton.Item
							label="Restaurant"
							value="restaurant"
						/>
						<RadioButton.Item
							label="Wedding Hall"
							value="wedding"
						/>
						<RadioButton.Item label="Home" value="home" />
					</RadioButton.Group>
				</View>
			)}
		</View>
	);
};

export default InputSelect;

const styles = StyleSheet.create({
	selectCover: {
		width: Sizes.width - 80,
	},
	identity: {
		backgroundColor: "white",
		borderRadius: 20,
		marginTop: 10,
		marginHorizontal: 2,
		color: "black",
	},
});
