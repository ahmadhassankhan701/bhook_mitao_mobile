import {
	View,
	Text,
	StyleSheet,
	ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Sizes, colors } from "../../../utils/theme";
import {
	collectionGroup,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { LineChart } from "react-native-chart-kit";
import SupplierFooter from "../../../components/Footer/SupplierFooter";
import { Card } from "react-native-paper";
const Homepage = ({ navigation }) => {
	const { state } = useContext(AuthContext);
	const [donations, setDonations] = useState([]);
	const [loading, setLoading] = useState(false);
	const userId =
		state && state.user ? state.user.userId : "";
	useEffect(() => {
		getDonations();
	}, []);
	const getDonations = async () => {
		setLoading(true);
		const donations = query(
			collectionGroup(db, "food"),
			where("assignedBy.orgId", "==", `${userId}`),
			where("status", "==", "done"),
			orderBy("createdAt", "desc")
		);
		getDocs(donations)
			.then((querySnapshot) => {
				let items = [];
				if (querySnapshot.size == 0) {
					setLoading(false);
					return;
				} else {
					querySnapshot.forEach((doc) => {
						items.push({ key: doc.id, ...doc.data() });
					});
				}
				setDonations(items);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				console.log(error);
			});
	};
	return (
		<View style={styles.container}>
			<View style={styles.main}>
				<View style={styles.wrapper}>
					<Text
						style={{
							marginTop: 10,
							fontSize: 25,
							color: "white",
						}}
					>
						Hello, Ahmad
					</Text>
					<Text
						style={{
							marginVertical: 10,
							fontSize: 15,
							color: "#4C4E52",
						}}
					>
						Welcome to Bhook Mitao
					</Text>
					<View>
						<View style={{ marginVertical: 10 }}>
							<Text
								style={{
									marginVertical: 10,
									fontSize: 20,
									textAlign: "center",
									color: "white",
								}}
							>
								Food Donations
							</Text>
							<LineChart
								data={{
									labels: [
										"Mon",
										"Tue",
										"Wed",
										"Thu",
										"Fri",
										"Sat",
										"Sun",
									],
									datasets: [
										{
											data: [
												Math.random() * 100,
												Math.random() * 100,
												Math.random() * 100,
												Math.random() * 100,
												Math.random() * 100,
												Math.random() * 100,
												Math.random() * 100,
											],
										},
									],
								}}
								// data={{
								// 	datasets: [
								// 		{
								// 			data: chartData,
								// 		},
								// 	],
								// }}
								width={Sizes.width - 20}
								height={170}
								yAxisInterval={1} // optional, defaults to 1
								chartConfig={{
									backgroundColor: "#4C4E52",
									backgroundGradientFrom: "#6F7378",
									backgroundGradientTo: "#4C4E52",
									decimalPlaces: 0, // optional, defaults to 2dp
									color: (opacity = 1) =>
										`rgba(255, 255, 255, ${opacity})`,
									labelColor: (opacity = 1) =>
										`rgba(255, 255, 255, ${opacity})`,
									style: {
										borderRadius: 16,
									},
									propsForDots: {
										r: "6",
										strokeWidth: "2",
										stroke: "#ffa726",
									},
								}}
								bezier
								style={{
									borderRadius: 16,
								}}
							/>
						</View>
					</View>
					<View>
						<Text
							style={{
								marginVertical: 10,
								fontSize: 20,
								textAlign: "center",
								color: "white",
							}}
						>
							Statistics
						</Text>
						<Card
							style={{
								marginTop: 5,
								backgroundColor: "#4C4E52",
								borderRadius: 10,
							}}
						>
							<Card.Content style={styles.CardContent}>
								<Text style={styles.title}>Completed</Text>
								<Text style={styles.value}>7</Text>
							</Card.Content>
						</Card>
						<Card
							style={{
								marginTop: 5,
								backgroundColor: "#4C4E52",
								borderRadius: 10,
							}}
						>
							<Card.Content style={styles.CardContent}>
								<Text style={styles.title}>Accepted</Text>
								<Text style={styles.value}>10</Text>
							</Card.Content>
						</Card>
						<Card
							style={{
								marginTop: 5,
								backgroundColor: "#4C4E52",
								borderRadius: 10,
							}}
						>
							<Card.Content style={styles.CardContent}>
								<Text style={styles.title}>Rejected</Text>
								<Text style={styles.value}>3</Text>
							</Card.Content>
						</Card>
					</View>
				</View>
			</View>
			<View style={styles.footer}>
				<SupplierFooter />
			</View>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
	wrapper: {
		width: Sizes.width - 20,
		alignSelf: "center",
		marginTop: 20,
	},
	main: {
		height: Sizes.height * 0.8,
	},
	footer: {
		height: Sizes.height * 0.2,
	},
	CardContent: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	title: {
		fontSize: 15,
		color: "white",
	},
	value: {
		fontSize: 20,
		color: "white",
	},
});

export default Homepage;
