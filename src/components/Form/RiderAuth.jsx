import { StyleSheet, Text, View } from "react-native";
import React from "react";
import InputText from "../Input/InputText";
import { useState } from "react";
import { Button } from "react-native-paper";
import { colors } from "../../utils/theme";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase";

const RiderAuth = () => {
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
		return;
		// setLoading(true);
		// const docRef = doc(db, `Riders`, `${detail.ID}`);
		// getDoc(docRef)
		// 	.then((docSnap) => {
		// 		if (docSnap.exists()) {
		// 			setLoading(false);
		// 			const data = docSnap.data();
		// 			if (data.riderPassword == detail.Password) {
		// 				alert("User found");
		// 				// const user = {
		// 				// 	userId: datas.riderId,
		// 				// 	category: "rider",
		// 				// 	image: datas.image,
		// 				// 	name: datas.name,
		// 				// };
		// 				// const token = datas.riderId;
		// 				// const stateData = { user, token };
		// 				// setState({
		// 				// 	user: stateData.user,
		// 				// 	token: stateData.token,
		// 				// });
		// 				// window.localStorage.setItem(
		// 				// 	"auth",
		// 				// 	JSON.stringify(stateData)
		// 				// );
		// 				// route.push("/user/rider/dashboard");
		// 			} else {
		// 				toast.error("Password not Matched!");
		// 			}
		// 		} else {
		// 			setLoading(false);
		// 			alert("User not found!");
		// 		}
		// 	})
		// 	.catch((error) => {
		// 		toast.error("Exception Occured");
		// 		setLoading(false);
		// 		console.log(error);
		// 	});
	};
	return (
		<View>
			<InputText
				title={"ID"}
				icon={"account"}
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
				>
					Submit
				</Button>
			</View>
		</View>
	);
};

export default RiderAuth;

const styles = StyleSheet.create({});
