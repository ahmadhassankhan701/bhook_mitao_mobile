import React, { useState } from "react";
import {
	SafeAreaView,
	View,
	Text,
	StyleSheet,
	Image,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { Sizes, colors } from "../utils/theme";
import { Button } from "react-native-paper";
const slides = [
	{
		id: 1,
		title: "Title",
		desc: "You have two hands one to help yourself, the second to help others.",
		image: require("../assets/intro1.png"),
	},
	{
		id: 2,
		title: "Title",
		desc: "If you cant feed a hundred people,then just feed one. ",
		image: require("../assets/intro2.png"),
	},
	{
		id: 3,
		title: "Title",
		desc: "Giving is not just about	making a donation, it is about making a difference.",
		image: require("../assets/intro3.png"),
	},
];
const Intro = ({ navigation }) => {
	const [showHomePage, setShowHomePage] = useState(false);
	const buttonLabel = (label) => {
		return (
			<View style={{ padding: 12 }}>
				<Text
					style={{
						color: colors.primary,
						fontWeight: "600",
						fontSize: Sizes.h4,
					}}
				>
					{label}
				</Text>
			</View>
		);
	};
	if (!showHomePage) {
		return (
			<AppIntroSlider
				data={slides}
				renderItem={({ item }) => {
					return (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								padding: 10,
								paddingTop: 100,
								backgroundColor: "#000",
							}}
						>
							<Image
								source={item.image}
								style={{
									width: Sizes.width - 80,
									height: 400,
								}}
								resizeMode={"contain"}
							/>
							<Text
								style={{
									textAlign: "center",
									color: colors.desc,
									paddingTop: 5,
									fontSize: 15,
								}}
							>
								{item.desc}
							</Text>
						</View>
					);
				}}
				activeDotStyle={{
					backgroundColor: colors.primary,
					width: 30,
				}}
				dotStyle={{
					backgroundColor: colors.primary,
				}}
				showSkipButton
				renderNextButton={() => buttonLabel("Next")}
				renderSkipButton={() => buttonLabel("Skip")}
				renderDoneButton={() => buttonLabel("Done")}
				onDone={() => setShowHomePage(true)}
				onSkip={() => setShowHomePage(true)}
			/>
		);
	}
	return (
		<SafeAreaView
			style={{ flex: 1, backgroundColor: "#000" }}
		>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					padding: 10,
					paddingTop: 20,
				}}
			>
				<Image
					source={require("../assets/started.png")}
					style={{
						width: Sizes.width - 80,
						height: 400,
					}}
					resizeMode={"contain"}
				/>
				<View
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					<Button
						mode="contained"
						onPress={() =>
							navigation.navigate("login", {
								categ: "donor",
							})
						}
						buttonColor={colors.primary}
						style={{
							marginVertical: 10,
							width: 200,
							borderRadius: 10,
						}}
					>
						Donor
					</Button>
					<Button
						mode="contained"
						onPress={() =>
							navigation.navigate("login", {
								categ: "supplier",
							})
						}
						buttonColor={colors.primary}
						style={{
							marginVertical: 10,
							width: 200,
							borderRadius: 10,
						}}
					>
						Supplier
					</Button>
					<Button
						mode="contained"
						onPress={() =>
							navigation.navigate("login", {
								categ: "rider",
							})
						}
						buttonColor={colors.primary}
						style={{
							marginVertical: 10,
							width: 200,
							borderRadius: 10,
						}}
					>
						Rider
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	header: {
		fontFamily: "Montserrat-Regular",
		fontStyle: "normal",
		fontWeight: "600",
		width: 345.67,
		height: 22.67,
		fontSize: 19.1667,
		lineHeight: 23,
		alignSelf: "center",
		textAlign: "center",
		color: "#000000",
	},
});
export default Intro;
