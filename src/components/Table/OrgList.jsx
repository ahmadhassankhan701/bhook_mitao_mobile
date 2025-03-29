import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
	Card,
	IconButton,
	RadioButton,
} from "react-native-paper";
import { colors } from "../../utils/theme";

const OrgList = ({ orgs, selectedOrg, setSelectedOrg }) => {
	return (
		<View>
			{/* <Text style={{ color: "white" }}>
				{JSON.stringify(org, null, 4)}
			</Text> */}
			{orgs.map((org) => (
				<Card style={styles.card} key={org.key}>
					<Card.Content
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Text style={styles.title}>{org.name}</Text>
						<IconButton
							icon={
								selectedOrg && selectedOrg.orgId === org.key
									? "check-circle"
									: "check-circle-outline"
							}
							iconColor="green"
							mode="contained"
							onPress={() => {
								setSelectedOrg({
									orgId: org.key,
									orgName: org.name,
									push_token: org.push_token,
								});
							}}
						/>
					</Card.Content>
				</Card>
			))}
		</View>
	);
};

export default OrgList;

const styles = StyleSheet.create({
	title: {
		color: "white",
		fontSize: 20,
		width: "70%",
	},
	card: {
		backgroundColor: colors.primary,
		borderRadius: 10,
		marginVertical: 10,
	},
});
