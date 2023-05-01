import React from "react";
import {
	StyleSheet,
	View,
	Text,
	KeyboardAvoidingView,
} from "react-native";
import InputText from "../Input/InputText";
import {
	Avatar,
	Button,
	IconButton,
} from "react-native-paper";
import { colors } from "../../utils/theme";
import { ScrollView } from "react-native";

const EventForm = ({
	detail,
	loading,
	handleImage,
	handleChange,
	handleSubmit,
	uploadedImage,
	mode,
}) => {
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Avatar.Image
				size={120}
				source={
					uploadedImage != ""
						? { uri: uploadedImage }
						: require("../../assets/org.jpeg")
				}
				style={{ marginVertical: 30 }}
			/>
			<IconButton
				icon={"camera"}
				mode="contained"
				containerColor={colors.primary}
				iconColor="white"
				onPress={handleImage}
			/>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={
					Platform.OS === "ios" ? "padding" : "height"
				}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View>
						<InputText
							title={"Title *"}
							name={"title"}
							icon={"format-title"}
							handleChange={handleChange}
							value={detail.title}
						/>
						<InputText
							title={"Description *"}
							name={"desc"}
							icon={"note"}
							handleChange={handleChange}
							value={detail.desc}
						/>
						<View
							style={{
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
							}}
						>
							<Button
								icon="login"
								mode="contained"
								onPress={handleSubmit}
								style={{
									width: 150,
									marginVertical: 10,
									backgroundColor: colors.primary,
									color: "white",
								}}
								loading={loading}
								disabled={loading}
							>
								{mode == "edit" ? "Update" : "Add"}
							</Button>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default EventForm;

const styles = StyleSheet.create({});
