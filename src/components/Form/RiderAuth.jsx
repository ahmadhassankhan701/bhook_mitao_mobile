import { StyleSheet, View } from "react-native";
import React from "react";
import InputText from "../Input/InputText";
import { useState } from "react";
import { Button } from "react-native-paper";
import { colors } from "../../utils/theme";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const RiderAuth = () => {
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
		<View>
			<InputText
				title={"ID *"}
				icon={"badge-account"}
				handleChange={handleChange}
			/>
			<InputText
				title={"Password *"}
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
		</View>
	);
};

export default RiderAuth;

const styles = StyleSheet.create({});
