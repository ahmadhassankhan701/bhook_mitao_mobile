import { StyleSheet, Text } from "react-native";
import React from "react";
import { Button, Dialog, Portal } from "react-native-paper";
import { View } from "react-native";

const Failure = ({ visible, setVisible, title, icon }) => {
	const hideDialog = () => setVisible(false);
	return (
		<Portal>
			<Dialog
				style={{
					backgroundColor: "#DC3545",
					borderRadius: 10,
				}}
				visible={visible}
				onDismiss={hideDialog}
			>
				<Dialog.Icon size={50} icon={icon} color="white" />
				<Dialog.Title
					style={{
						color: "#fff",
						textAlign: "center",
						fontSize: 17,
					}}
				>
					{title}
				</Dialog.Title>
				<View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						padding: 2,
					}}
				>
					<Button
						mode="contained"
						buttonColor={"green"}
						onPress={hideDialog}
						theme={{ roundness: 0 }}
					>
						Ok
					</Button>
				</View>
			</Dialog>
		</Portal>
	);
};

export default Failure;

const styles = StyleSheet.create({});
