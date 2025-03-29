import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import React from "react";
import InputText from "../components/Input/InputText";
import { useState } from "react";
import { Avatar, Button } from "react-native-paper";
import { colors } from "../utils/theme";
import { ScrollView } from "react-native";

const SupplierRegister = ({ navigation }) => {
	const [data, setData] = useState({
		category: "supplier",
		name: "",
		email: "",
		password: "",
	});
	const [error, setError] = useState({
		nameError: "",
		emailError: "",
		passwordError: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = async (name, val) => {
		if (name == "name") {
			setData({
				...data,
				name: val,
			});
			if (!isNaN(+val) || val.length < 3) {
				setError({
					...error,
					nameError: "Characters only and more than 2",
				});
			} else {
				setError({
					...error,
					nameError: "",
				});
			}
		}
		if (name == "email") {
			handleEmail(val);
		}
		if (name == "password") {
			setData({
				...data,
				password: val,
			});
			if (val.length < 6 || val.length > 14) {
				setError({
					...error,
					passwordError:
						"Password should be 6-14 characters",
				});
			} else {
				setError({
					...error,
					passwordError: "",
				});
			}
		}
	};
	const handleEmail = async (val) => {
		setData({ ...data, email: val });
		const regex =
			/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		if (regex.test(val) === false) {
			setError({
				...error,
				emailError: "Email is invalid",
			});
		} else {
			setError({ ...error, emailError: "" });
		}
	};
	const handleSubmit = async () => {
		if (
			data.email == "" ||
			data.password == "" ||
			data.name == ""
		) {
			alert("* fields are required");
			return;
		}
		var emptyError =
			error.nameError == "" &&
			error.emailError == "" &&
			error.passwordError == "";
		if (emptyError == false) {
			alert("Please clear the errors");
			return;
		}
		navigation.navigate("SupplierRegisterFinal", { data });
	};
	return (
		<View style={styles.container}>
			<Avatar.Image
				size={100}
				source={require("../assets/org.jpg")}
				style={{ marginTop: 50 }}
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
						/>
						{error.nameError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
								}}
							>
								{error.nameError}
							</Text>
						)}
						<InputText
							title={"Email *"}
							name={"email"}
							icon={"badge-account"}
							handleChange={handleChange}
						/>
						{error.emailError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
								}}
							>
								{error.emailError}
							</Text>
						)}
						<InputText
							title={"Password *"}
							name={"password"}
							icon={"shield-key"}
							handleChange={handleChange}
							showPassword={showPassword}
							setShowPassword={setShowPassword}
						/>
						{error.passwordError != "" && (
							<Text
								style={{
									color: "red",
									textAlign: "center",
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
								icon="arrow-right"
								mode="contained"
								onPress={handleSubmit}
								style={{
									width: 150,
									marginVertical: 10,
									backgroundColor: colors.primary,
									color: "white",
									borderRadius: 10,
								}}
							>
								Next
							</Button>
						</View>
						<View
							style={{
								display: "flex",
								flexDirection: "row",
								alignItems: "center",
								marginVertical: 5,
								marginHorizontal: 10,
							}}
						>
							<Text style={{ color: "#fff" }}>
								Already a member?
							</Text>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate("login", {
										categ: "supplier",
									})
								}
							>
								<Text
									style={{
										paddingHorizontal: 5,
										color: colors.primary,
									}}
								>
									Sign In
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default SupplierRegister;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
});
