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
import { db } from "../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";

const DonorAuth = () => {
	const { setState } = useContext(AuthContext);
	const navigation = useNavigation();
	const [detail, setDetail] = useState({
		ID: "",
		Password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleChange = async (name, val) => {
		setDetail({ ...detail, [name]: val });
	};
	const handleSubmit = async () => {
		setLoading(true);
		const docRef = doc(db, `Riders`, `${detail.ID}`);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					setLoading(false);
					const data = docSnap.data();
					if (data.riderPassword == detail.Password) {
						const user = {
							userId: detail.ID,
							category: "rider",
							image: data.image,
							name: data.name,
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
						toast.error("Password not Matched!");
					}
				} else {
					setLoading(false);
					alert("User not found!");
				}
			})
			.catch((error) => {
				toast.error("Exception Occured");
				setLoading(false);
				console.log(error);
			});
	};
	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={
				Platform.OS === "ios" ? "padding" : "height"
			}
		>
			<ScrollView showsVerticalScrollIndicator={false}>
				<View>
					<InputText
						title={"Full Name"}
						icon={"account"}
						handleChange={handleChange}
					/>
					<InputText
						title={"ID"}
						icon={"badge-account"}
						handleChange={handleChange}
					/>
					<InputText
						title={"Password"}
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
							icon="camera"
							mode="contained"
							onPress={handleSubmit}
							style={{
								width: 150,
								marginVertical: 10,
								backgroundColor: colors.primary,
							}}
							loading={loading}
							disabled={
								detail.ID == "" ||
								detail.Password == "" ||
								loading
							}
						>
							Submit
						</Button>
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
							onPress={() => alert("image clicked")}
						>
							<Image
								source={require("../../assets/googleLogin.png")}
								style={{
									width: 210,
									alignSelf: "center",
									borderRadius: 10,
									marginVertical: 5,
								}}
							/>
						</TouchableOpacity>
						<Button
							icon={"facebook"}
							mode="contained"
							style={{
								width: 200,
								alignSelf: "center",
								backgroundColor: "#4285f4",
								marginVertical: 5,
								borderRadius: 5,
							}}
						>
							Login With Facebook
						</Button>
					</View>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
};

export default DonorAuth;

const styles = StyleSheet.create({});
