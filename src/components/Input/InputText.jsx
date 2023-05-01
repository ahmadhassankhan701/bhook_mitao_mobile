import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";

const InputText = ({
	title,
	icon,
	name,
	handleChange,
	showPassword,
	setShowPassword,
	value,
}) => {
	return (
		<TextInput
			label={title}
			left={<TextInput.Icon icon={icon} />}
			right={
				(title == "Password *" ||
					title == "New Password *") && (
					<TextInput.Icon
						onPress={() => setShowPassword(!showPassword)}
						icon={"eye"}
					/>
				)
			}
			mode="outlined"
			style={{
				backgroundColor: "#ffffff",
				width: Sizes.width - 80,
				marginVertical: 10,
			}}
			outlineColor="transparent"
			activeOutlineColor={colors.primary}
			selectionColor={colors.desc}
			theme={{ roundness: 30 }}
			onChangeText={(text) => handleChange(name, text)}
			secureTextEntry={
				(title == "Password *" ||
					title == "New Password *") &&
				!showPassword
			}
			multiline={name == "desc" ? true : false}
			numberOfLines={name == "desc" ? 3 : 1}
			keyboardType={
				name == "phone" ||
				name == "quantity" ||
				name == "zip"
					? "numeric"
					: "default"
			}
			value={value}
		/>
	);
};

export default InputText;

const styles = StyleSheet.create({});
