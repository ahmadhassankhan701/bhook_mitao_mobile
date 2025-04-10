import {
	StyleSheet,
	View,
	Text,
	Image,
	TouchableOpacity,
	KeyboardAvoidingView,
} from "react-native";
import React from "react";
import InputText from "../Input/InputText";
import { useState } from "react";
import { Button, IconButton } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { signUpGoogle } from "../../utils/Helpers/SocialAuth";
import { useEffect } from "react";
import {
	sendEmailVerification,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { activateNotify } from "../../utils/Helpers/NotifyConfig";
WebBrowser.maybeCompleteAuthSession();

const DonorAuth = () => {
	const { setState } = useContext(AuthContext);
	const [request, response, promptAsync] =
		Google.useAuthRequest({
			expoClientId:
				"476108153065-qlhshp9oj818po3ea1bn1s8a0fspedh2.apps.googleusercontent.com",
			androidClientId:
				"476108153065-20s4j8reaad7m9ud6f6tarqc8vr3vojt.apps.googleusercontent.com",
		});
	const navigation = useNavigation();
	const [detail, setDetail] = useState({
		email: "",
		password: "",
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
		setDetail({ ...detail, [name]: val });
	};
	const handleSubmit = async () => {
		if (detail.email == "" || detail.password == "") {
			alert("Please fill all the fields");
			return;
		}
		setLoading(true);
		signInWithEmailAndPassword(
			auth,
			detail.email,
			detail.password
		)
			.then((userCredential) => {
				const users = userCredential.user;
				handleMailVerification(users);
			})
			.catch((error) => {
				const errorMessage = error.message;
				setLoading(false);
				alert(errorMessage);
			});
	};
	const handleMailVerification = async (users) => {
		if (users.emailVerified == false) {
			sendEmailVerification(auth.currentUser).then(() => {
				alert(
					"Verification link sent to your email. Please verify then login!"
				);
			});
			setLoading(false);
			return false;
		}
		const docRef = doc(db, `Auth/donor/users`, users.uid);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					// console.log("Document data:", docSnap.data());
					const res = docSnap.data();
					const push_token = activateNotify(docRef);
					const user = {
						userId: users.uid,
						category: res.category,
						email: res.email,
						image: res.image,
						name: res.name,
						push_token,
						provider: "custom",
					};
					const stateData = { user };
					setState({
						user: stateData.user,
					});
					AsyncStorage.setItem(
						"bhook_auth",
						JSON.stringify(stateData)
					);
					navigation.navigate("Homepage");
				} else {
					alert("User not found");
					setLoading(false);
				}
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={
				Platform.OS === "ios" ? "padding" : "height"
			}
		>
			<View>
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
					<Text style={{ color: "white" }}>
						Not a member?
					</Text>
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("DonorRegister")
						}
					>
						<Text
							style={{
								paddingHorizontal: 5,
								color: colors.primary,
							}}
						>
							Register
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
							width: 130,
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
								borderRadius: 10,
								padding: 15,
								color: "white",
							}}
						>
							OR
						</Text>
					</View>
					<View
						style={{
							width: 130,
							height: 1,
							backgroundColor: "gray",
						}}
					/>
				</View>
				<View>
					<Button
						mode="outlined"
						textColor={"lightgray"}
						style={{
							borderColor: "lightgray",
							marginVertical: 10,
						}}
						icon={"google"}
						onPress={() => promptAsync()}
						disabled={!request}
					>
						Sign in with google
					</Button>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default DonorAuth;

const styles = StyleSheet.create({
	google_btn: {
		width: Sizes.width - 50,
		height: 45,
		backgroundColor: colors.primary,
		borderRadius: 10,
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
		borderTopLeftRadius: 5,
		borderBottomLeftRadius: 5,
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
		fontSize: 15,
		fontWeight: "bold",
		fontFamily: "Roboto",
		letterSpacing: 0.2,
		color: "#fff",
	},
});
