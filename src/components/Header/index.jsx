import React from "react";
import { Appbar } from "react-native-paper";
import { colors } from "../../utils/theme";

export default function index({ showModal }) {
	return (
		<Appbar.Header
			style={{
				display: "flex",
				justifyContent: "flex-end",
			}}
		>
			<Appbar.Action
				icon="logout"
				color={colors.primary}
				onPress={showModal}
			/>
		</Appbar.Header>
	);
}
