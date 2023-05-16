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
import { activateNotify } from "../../utils/Helpers/NotifyConfig";
import { useNavigation } from "@react-navigation/native";

const RiderAuth = () => {
	const { setState } = useContext(AuthContext);
	const navigation = useNavigation();
	const [detail, setDetail] = useState({
		id: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const handleChange = async (name, val) => {
		setDetail({ ...detail, [name]: val });
	};
	const handleSubmit = async () => {
		if (detail.id == "" || detail.password == "") {
			alert("Please fill all the fields");
			return;
		}
		setLoading(true);
		const docRef = doc(db, `Riders`, `${detail.id}`);
		getDoc(docRef)
			.then((docSnap) => {
				if (docSnap.exists()) {
					setLoading(false);
					const data = docSnap.data();
					if (data.riderPassword == detail.password) {
						const push_token = activateNotify(docRef);
						const user = {
							userId: detail.id,
							category: "rider",
							image: data.image,
							name: data.name,
							push_token,
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
						alert("Password not Matched!");
					}
				} else {
					setLoading(false);
					alert("User not found!");
				}
			})
			.catch((error) => {
				alert("Exception Occured");
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
				name={"id"}
				value={detail.id}
			/>
			<InputText
				title={"Password *"}
				icon={"shield-key"}
				name={"password"}
				handleChange={handleChange}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				value={detail.password}
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
					}}
					loading={loading}
					disabled={loading}
				>
					Submit
				</Button>
			</View>
		</View>
	);
};

export default RiderAuth;

const styles = StyleSheet.create({});
