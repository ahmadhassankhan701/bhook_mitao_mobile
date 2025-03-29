import { StyleSheet, Text, View } from "react-native";
import {
	IconButton,
	Modal,
	Portal,
} from "react-native-paper";
import React from "react";
import { Sizes, colors } from "../../utils/theme";
import { TouchableOpacity } from "react-native";
const InputSelect = ({
	identity,
	setIdentity,
	visible,
	setVisible,
}) => {
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: colors.primary,
		padding: 20,
		width: Sizes.width - 80,
		alignSelf: "center",
	};
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
						borderRadius: 10,
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
			{/* {visible && (
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
			)} */}
			<Portal>
				<Modal
					visible={visible}
					onDismiss={hideModal}
					contentContainerStyle={containerStyle}
				>
					<View>
						<View
							style={{
								marginVertical: 10,
							}}
						>
							<Text
								style={{
									color: "white",
									marginVertical: 10,
									fontSize: 18,
								}}
								onPress={() => {
									setIdentity("hotel");
									setVisible(false);
								}}
							>
								Hotel
							</Text>
							<Text
								style={{
									color: "white",
									marginVertical: 10,
									fontSize: 18,
								}}
								onPress={() => {
									setIdentity("restaurant");
									setVisible(false);
								}}
							>
								Restaurant
							</Text>
							<Text
								style={{
									color: "white",
									marginVertical: 10,
									fontSize: 18,
								}}
								onPress={() => {
									setIdentity("wedding");
									setVisible(false);
								}}
							>
								Wedding Hall
							</Text>
							<Text
								style={{
									color: "white",
									marginVertical: 10,
									fontSize: 18,
								}}
								onPress={() => {
									setIdentity("home");
									setVisible(false);
								}}
							>
								Home
							</Text>
						</View>
					</View>
				</Modal>
			</Portal>
		</View>
	);
};

export default InputSelect;

const styles = StyleSheet.create({
	selectCover: {
		width: Sizes.width - 50,
	},
	identity: {
		backgroundColor: "white",
		borderRadius: 20,
		marginTop: 10,
		marginHorizontal: 2,
		color: "black",
	},
});
