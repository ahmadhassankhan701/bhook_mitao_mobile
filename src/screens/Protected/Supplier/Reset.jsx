import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, Card } from "react-native-paper";
import InputText from "../../../components/Input/InputText";
import { useState } from "react";
import { Sizes, colors } from "../../../utils/theme";
import { auth } from "../../../../firebase";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	updatePassword,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";

const Reset = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [data, setData] = useState({
		email: "",
		password: "",
		newPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [newShowPassword, setNewShowPassword] =
		useState(false);
	const handleChange = async (name, val) => {
		setData({ ...data, [name]: val });
	};
	const handleSubmit = async () => {
		if (
			data.email === "" ||
			data.password === "" ||
			data.newPassword === ""
		) {
			alert("Please fill all the fields");
			return;
		}
		if (data.password === data.newPassword) {
			alert("New password cannot be same as old password");
			return;
		}
		setLoading(true);
		const user = auth.currentUser;
		const credential = EmailAuthProvider.credential(
			data.email,
			data.password
		);
		reauthenticateWithCredential(user, credential)
			.then(() => {
				const newPassword = data.newPassword;
				updatePassword(user, newPassword)
					.then(() => {
						setLoading(false);
						alert("Password Updated Successfully");
						AsyncStorage.removeItem("bhook_auth");
						setState({ ...state, user: null });
						navigation.navigate("login", {
							categ: "supplier",
						});
					})
					.catch((error) => {
						// An error ocurred
						const errorMessage = error.message;
						setLoading(false);
						alert(errorMessage);
						console.log(error);
					});
			})
			.catch((error) => {
				// An error ocurred
				setLoading(false);
				setOk(false);
				toast.error(error.message);
				console.log(error.message);
			});
	};
	return (
		<View style={styles.container}>
			<Card style={styles.card}>
				<Card.Content style={styles.center}>
					<InputText
						title={"Email *"}
						name={"email"}
						icon={"badge-account"}
						handleChange={handleChange}
					/>
					<InputText
						title={"Password *"}
						name={"password"}
						icon={"shield-key"}
						handleChange={handleChange}
						showPassword={showPassword}
						setShowPassword={setShowPassword}
					/>
					<InputText
						title={"New Password *"}
						name={"newPassword"}
						icon={"shield-key"}
						handleChange={handleChange}
						showPassword={newShowPassword}
						setShowPassword={setNewShowPassword}
					/>
					<Button
						icon="shield-key"
						mode="contained"
						buttonColor={"#000"}
						textColor="#fff"
						style={{ marginVertical: 10 }}
						onPress={handleSubmit}
						loading={loading}
						disabled={loading}
					>
						Reset
					</Button>
				</Card.Content>
			</Card>
		</View>
	);
};

export default Reset;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
	card: {
		width: Sizes.width - 20,
		backgroundColor: colors.primary,
	},
	center: {
		display: "flex",
		JustifyContent: "center",
		alignItems: "center",
	},
});
