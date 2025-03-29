import React from "react";
import {
	StyleSheet,
	View,
	KeyboardAvoidingView,
} from "react-native";
import InputText from "../Input/InputText";
import {
	Avatar,
	Button,
	IconButton,
} from "react-native-paper";
import { colors } from "../../utils/theme";
import { ScrollView } from "react-native";
import Confirm from "../Modal/Confirm";

const EventForm = ({
	detail,
	loading,
	handleImage,
	handleChange,
	handleSubmit,
	uploadedImage,
	mode,
}) => {
	const [visible, setVisible] = useState(true);
	const handleSubmitEvent = async () => {
		setVisible(false);
		handleSubmit();
	};
	return (
		<View
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<Confirm
				visible={visible}
				setVisible={setVisible}
				title={"Are you sure?"}
				subtitle={"Sure! You have reviewed the details"}
				icon={"alert"}
				handleAction={handleSubmitEvent}
			/>
			<Avatar.Image
				size={120}
				source={
					uploadedImage != ""
						? { uri: uploadedImage }
						: require("../../assets/events.jpeg")
				}
				style={{ marginVertical: 30 }}
			/>
			<IconButton
				icon={"camera"}
				mode="contained"
				containerColor={colors.primary}
				iconColor="white"
				onPress={handleImage}
			/>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={
					Platform.OS === "ios" ? "padding" : "height"
				}
			>
				<ScrollView showsVerticalScrollIndicator={false}>
					<View>
						<InputText
							title={"Title *"}
							name={"title"}
							icon={"format-title"}
							handleChange={handleChange}
							value={detail.title}
						/>
						<InputText
							title={"Description *"}
							name={"desc"}
							icon={"note"}
							handleChange={handleChange}
							value={detail.desc}
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
									borderRadius: 10,
								}}
								loading={loading}
								disabled={loading}
							>
								{mode == "edit" ? "Update" : "Add"}
							</Button>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</View>
	);
};

export default EventForm;

const styles = StyleSheet.create({});
