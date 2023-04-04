import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-paper";
import { Sizes, colors } from "../../utils/theme";

const InputText = ({
	title,
	icon,
	handleChange,
	showPassword,
	setShowPassword,
}) => {
	return (
		<View>
			<TextInput
				label={title}
				left={<TextInput.Icon icon={icon} />}
				right={
					title == "Password" && (
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
				onChangeText={(text) => handleChange(title, text)}
				secureTextEntry={
					title == "Password" && !showPassword
				}
			/>
		</View>
	);
};

export default InputText;

const styles = StyleSheet.create({});
