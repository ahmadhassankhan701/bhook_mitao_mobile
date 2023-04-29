import {
	StyleSheet,
	Text,
	View,
	ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import InputSelect from "../Input/InputSelect";
import InputText from "../Input/InputText";
import { useState } from "react";
import { Sizes, colors } from "../../utils/theme";
import { KeyboardAvoidingView } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const FoodEditForm = ({ data, userId, docId }) => {
	const [detail, setDetail] = useState({
		name: "",
		phone: "",
		quantity: 0,
		desc: "",
	});
	const [identity, setIdentity] = useState("hotel");
	const [error, setError] = useState({
		nameErr: "",
		phoneErr: "",
	});
	useEffect(() => {
		setDetail({
			...detail,
			name: data.detail.name,
			phone: data.detail.phone,
			quantity: data.detail.quantity,
			desc: data.detail.desc,
		});
		setIdentity(data.identity);
	}, []);

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
			detail.quantity != 0 &&
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
			userId,
			docId,
			detail,
			identity,
			loc: data.location,
		});
	};
	return (
		<View style={styles.container}>
			{/* <Text>{JSON.stringify(data, null, 4)}</Text> */}
			<View style={styles.appcover}>
				<KeyboardAvoidingView
					style={{
						width: Sizes.width - 10,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						marginVertical: 10,
					}}
					behavior={
						Platform.OS === "ios" ? "padding" : "height"
					}
				>
					<ScrollView showsVerticalScrollIndicator={false}>
						<InputSelect
							identity={identity}
							setIdentity={setIdentity}
						/>
						<InputText
							title={"Name *"}
							name={"name"}
							icon={"badge-account"}
							handleChange={handleChange}
							value={detail.name}
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
							value={detail.phone}
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
							value={detail.quantity}
						/>
						<InputText
							title={"Description *"}
							name={"desc"}
							icon={"note"}
							handleChange={handleChange}
							value={detail.desc}
						/>
					</ScrollView>
				</KeyboardAvoidingView>
				<Button
					icon={"chevron-right"}
					contentStyle={{ flexDirection: "row-reverse" }}
					mode="contained"
					buttonColor={colors.primary}
					onPress={() => handleNext()}
				>
					Next
				</Button>
			</View>
		</View>
	);
};

export default FoodEditForm;

const styles = StyleSheet.create({
	container: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		height: Sizes.height - 100,
	},
	appcover: {
		width: Sizes.width - 10,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
	},
	form: {
		marginVertical: 10,
	},
});
