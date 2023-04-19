import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import React from "react";
import InputText from "../components/Input/InputText";
import { useState } from "react";
import {
	Avatar,
	Button,
	IconButton,
} from "react-native-paper";
import { Sizes, colors } from "../utils/theme";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../src/context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import {
	createUserWithEmailAndPassword,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signUpGoogle } from "../utils/Helpers/SocialAuth";
import { useEffect } from "react";
WebBrowser.maybeCompleteAuthSession();

const DonorRegister = ({ navigation }) => {
	const { state, setState } = useContext(AuthContext);
	const [request, response, promptAsync] =
		Google.useAuthRequest({
			expoClientId:
				"476108153065-qlhshp9oj818po3ea1bn1s8a0fspedh2.apps.googleusercontent.com",
			androidClientId:
				"476108153065-20s4j8reaad7m9ud6f6tarqc8vr3vojt.apps.googleusercontent.com",
		});
	const [data, setData] = useState({
		category: "donor",
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
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (response?.type === "success") {
			signUpGoogle(
				response.authentication.accessToken,
				"donor"
			)
				.then((res) => {
					storeUser(res);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [response]);
	const storeUser = async (res) => {
		const userState = {
			user: res,
		};
		setState({
			user: userState.user,
		});
		await AsyncStorage.setItem(
			"bhook_auth",
			JSON.stringify(userState)
		);
		navigation.navigate("Homepage");
	};
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
		setLoading(true);
		createUserWithEmailAndPassword(
			auth,
			data.email,
			data.password
		)
			.then((userCredential) => {
				// Signed in
				const users = userCredential.user;
				updateProfile(auth.currentUser, {
					displayName: data.name,
				});
				handleMailVerification(users);
			})
			.catch((error) => {
				const errorMessage = error.message;
				setLoading(false);
				alert(errorMessage);
				console.log(error);
			});
	};
	const handleMailVerification = async (users) => {
		sendEmailVerification(auth.currentUser).then(() => {
			let user = {
				category: data.category,
				name: data.name,
				email: data.email,
				image: "",
			};
			setDoc(
				doc(db, `Auth/${data.category}/users`, users.uid),
				user
			)
				.then(() => {
					setLoading(false);
					alert(
						"Verification mail sent. Once verified you can login!"
					);
					navigation.navigate("login", {
						categ: "donor",
					});
				})
				.catch((e) => {
					setLoading(false);
					alert("Error adding user");
					console.log(e);
				});
		});
	};
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Avatar.Image
				size={150}
				source={require("../assets/donorLogo.jpg")}
				style={{ marginVertical: 30 }}
			/>
			<Text
				style={{
					color: colors.desc,
					fontSize: Sizes.h2,
					marginVertical: 10,
					fontWeight: "600",
				}}
			>
				Register
			</Text>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={
					Platform.OS === "ios" ? "padding" : "height"
				}
			>
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
							icon="camera"
							mode="contained"
							onPress={handleSubmit}
							style={{
								width: 150,
								marginVertical: 10,
								backgroundColor: colors.primary,
								color: "white",
							}}
							loading={loading}
						>
							Submit
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
						<Text>Already a member?</Text>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("login", {
									categ: "donor",
								})
							}
						>
							<Text
								style={{
									paddingHorizontal: 5,
									color: "#4285f4",
								}}
							>
								Sign In
							</Text>
						</TouchableOpacity>
					</View>
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							alignSelf: "center",
						}}
					>
						<View
							style={{
								width: 120,
								height: 1,
								backgroundColor: "gray",
							}}
						/>
						<View>
							<Text
								style={{
									width: 50,
									textAlign: "center",
									backgroundColor: `${colors.primary}`,
									borderRadius: 100,
									padding: 15,
									color: "white",
								}}
							>
								OR
							</Text>
						</View>
						<View
							style={{
								width: 120,
								height: 1,
								backgroundColor: "gray",
							}}
						/>
					</View>
					<View>
						<TouchableOpacity
							onPress={() => promptAsync()}
							disabled={!request}
							style={styles.google_btn}
						>
							<View style={styles.google_icon_wrapper}>
								<Image
									style={styles.google_icon}
									source={require("../assets/googleLogin.png")}
								/>
							</View>
							<Text style={styles.btn_text}>
								Sign up with google
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</View>
	);
};

export default DonorRegister;

const styles = StyleSheet.create({
	google_btn: {
		width: 200,
		height: 42,
		backgroundColor: "#4285f4",
		borderRadius: 2,
		display: "flex",
		flexDirection: "row",
		boxShadow: "0 3px 4px 0 rgba(0, 0, 0, 0.25)",
		alignItems: "center",
		alignSelf: "center",
		marginVertical: "5%",
	},
	google_icon_wrapper: {
		flex: 1,
		marginTop: 1,
		marginLeft: 1,
		width: 40,
		height: 40,
		borderRadius: 2,
		backgroundColor: "#fff",
	},
	google_icon: {
		marginTop: 11,
		marginLeft: 11,
		width: 20,
		height: 20,
	},
	btn_text: {
		flex: 4,
		alignSelf: "center",
		margin: 11,
		marginRight: 11,
		fontSize: 14,
		fontWeight: "bold",
		fontFamily: "Roboto",
		letterSpacing: 0.2,
		color: "#fff",
	},
});
