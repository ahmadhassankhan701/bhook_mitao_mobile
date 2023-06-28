import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Platform,
} from "react-native";
import React from "react";
import InputSelect from "../Input/InputSelect";
import InputText from "../Input/InputText";
import { useState } from "react";
import { Sizes, colors } from "../../utils/theme";
import { KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const FoodForm = () => {
	const { state } = useContext(AuthContext);
	const [detail, setDetail] = useState({
		name: "",
		phone: "",
		quantity: "",
		desc: "",
	});
	const [identity, setIdentity] = useState("");
	const [visible, setVisible] = useState(false);
	const [error, setError] = useState({
		nameErr: "",
		phoneErr: "",
	});
	const userId = state && state.user && state.user.userId;
	const navigation = useNavigation();
	const handleChange = async (name, val) => {
		if (name == "name") {
			setDetail({
				...detail,
				name: val,
			});
			if (!isNaN(+val) || val.length < 3) {
				setError({
					...error,
					nameErr: "Characters only and more than 2",
				});
			} else {
				setError({
					...error,
					nameErr: "",
				});
			}
		}
		if (name == "phone") {
			handlePhone(val);
		}
		if (name == "quantity") {
			setDetail({ ...detail, quantity: val });
		}
		if (name == "desc") {
			setDetail({ ...detail, desc: val });
		}
	};
	const handlePhone = async (value) => {
		setDetail({ ...detail, phone: value });
		const err =
			"Only Numbers starting with  3 and 10 characters long";
		if (
			isNaN(+value) ||
			Array.from(value)[0] != 3 ||
			value.length != 10
		) {
			setError({
				...error,
				phoneErr: err,
			});
		} else {
			setError({
				...error,
				phoneErr: "",
			});
		}
	};
	const handleNext = async () => {
		const proceed =
			detail.name != "" &&
			detail.phone != "" &&
			detail.quantity != "" &&
			detail.desc != "" &&
			identity != "";
		if (!proceed) {
			alert("Please fill all the fields");
			return;
		}
		const errors =
			error.nameErr != "" || error.phoneErr != "";
		if (errors) {
			alert("Please fix the errors");
			return;
		}
		navigation.navigate("FoodFinal", {
			detail,
			identity,
		});
	};
	return (
		<View style={styles.container}>
			<View style={styles.appcover}>
				<View>
					<KeyboardAvoidingView
						style={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							marginTop: 50,
						}}
						behavior={
							Platform.OS === "ios" ? "padding" : "height"
						}
					>
						<ScrollView
							showsVerticalScrollIndicator={false}
						>
							<InputSelect
								identity={identity}
								setIdentity={setIdentity}
								visible={visible}
								setVisible={setVisible}
							/>
							<InputText
								title={"Name *"}
								name={"name"}
								icon={"badge-account"}
								handleChange={handleChange}
							/>
							{error.nameErr != "" && (
								<Text
									style={{
										color: "red",
										textAlign: "center",
										maxWidth: 250,
									}}
								>
									{error.nameErr}
								</Text>
							)}
							<InputText
								title={"Phone *"}
								name={"phone"}
								icon={"phone"}
								handleChange={handleChange}
							/>
							{error.phoneErr != "" && (
								<Text
									style={{
										color: "red",
										textAlign: "center",
										maxWidth: 250,
									}}
								>
									{error.phoneErr}
								</Text>
							)}
							<InputText
								title={"For Persons *"}
								name={"quantity"}
								icon={"account-multiple"}
								handleChange={handleChange}
							/>
							<InputText
								title={"Description *"}
								name={"desc"}
								icon={"note"}
								handleChange={handleChange}
							/>
							<Button
								icon={"arrow-right"}
								contentStyle={{
									flexDirection: "row-reverse",
								}}
								style={{
									width: "50%",
									alignSelf: "center",
									borderRadius: 10,
								}}
								mode="contained"
								buttonColor={colors.primary}
								onPress={() => handleNext()}
							>
								Next
							</Button>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			</View>
		</View>
	);
};

export default FoodForm;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	appcover: {
		width: Sizes.width - 10,
	},
	form: {
		marginVertical: 10,
	},
});
