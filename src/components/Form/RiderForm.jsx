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

const RiderForm = ({
	detail,
	error,
	loading,
	handleImage,
	showPassword,
	setShowPassword,
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
						: require("../../assets/helmetLogo.jpg")
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
							title={"Name *"}
							name={"name"}
							icon={"account"}
							handleChange={handleChange}
							value={detail.name}
						/>
						{error.nameError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
									maxWidth: 250,
								}}
							>
								{error.nameError}
							</Text>
						)}
						<InputText
							title={"Phone *"}
							name={"phone"}
							icon={"phone"}
							handleChange={handleChange}
							value={detail.phone}
						/>
						{error.phoneError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
									maxWidth: 250,
								}}
							>
								{error.phoneError}
							</Text>
						)}
						<InputText
							title={"Id *"}
							name={"id"}
							icon={"account-box"}
							handleChange={handleChange}
							value={detail.id}
						/>
						<InputText
							title={"Password *"}
							name={"password"}
							icon={"shield-key"}
							handleChange={handleChange}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
							value={detail.password}
						/>
						{error.passwordError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
									maxWidth: 250,
								}}
							>
								{error.passwordError}
							</Text>
						)}
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

export default RiderForm;

const styles = StyleSheet.create({});
