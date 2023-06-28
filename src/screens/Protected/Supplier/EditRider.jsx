import { StyleSheet, View } from "react-native";
import React from "react";
import { useState } from "react";

import { db, storage } from "../../../../firebase";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import {
	doc,
	getDoc,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import RiderForm from "../../../components/Form/RiderForm";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { useEffect } from "react";
const EditRider = ({ navigation, route }) => {
	const { state } = useContext(AuthContext);
	const { riderId } = route.params;
	const userId = state && state.user && state.user.userId;
	const [detail, setDetail] = useState({
		image: "",
		name: "",
		phone: "",
		id: "",
		password: "",
	});
	const [error, setError] = useState({
		nameError: "",
		phoneError: "",
		passwordError: "",
	});
	const [uploadedImage, setUploadedImage] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const getRider = async () => {
			try {
				const docRef = doc(db, `Riders`, `${riderId}`);
				const docSnap = await getDoc(docRef);
				if (docSnap.exists()) {
					const requestedRider = docSnap.data();
					setDetail({
						...detail,
						name: requestedRider.name,
						phone: requestedRider.phone,
						id: requestedRider.riderId,
						password: requestedRider.riderPassword,
					});
					setUploadedImage(requestedRider.image);
				} else {
					alert("No such document!");
					navigation.goBack();
				}
			} catch (error) {
				alert("Something went wrong");
				console.log(error);
				navigation.goBack();
			}
		};
		userId && getRider();
	}, [userId]);

	const handleChange = async (name, val) => {
		if (name == "name") {
			setDetail({
				...detail,
				name: val,
			});
			if (!isNaN(+val) || val.length < 3) {
				setError({
					...error,
					nameError: "Characters only and more than 2",
				});
			} else {
				setError({
					...error,
					nameError: "",
				});
			}
		}
		if (name == "phone") {
			handlePhone(val);
		}
		if (name == "id") {
			setDetail({ ...detail, id: val });
		}
		if (name == "password") {
			setDetail({
				...detail,
				password: val,
			});
			if (val.length < 6 || val.length > 14) {
				setError({
					...error,
					passwordError:
						"Password should be 6-14 characters",
				});
			} else {
				setError({
					...error,
					passwordError: "",
				});
			}
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
				phoneError: err,
			});
		} else {
			setError({
				...error,
				phoneError: "",
			});
		}
	};
	const handleUpdate = async () => {
		if (
			detail.password == "" ||
			detail.name == "" ||
			detail.phone == "" ||
			detail.id == "" ||
			uploadedImage == ""
		) {
			alert("Please fill all the fields");
			return;
		}
		if (
			error.nameError != "" ||
			error.phoneError != "" ||
			error.passwordError != ""
		) {
			alert("Please fill all the fields correctly");
			return;
		}
		try {
			const rider = {
				name: detail.name,
				phone: detail.phone,
				image: uploadedImage,
				riderId: detail.id,
				riderPassword: detail.password,
				userId,
				createdAt: serverTimestamp(),
			};
			setLoading(true);
			const riderRef = doc(db, "Riders", detail.id);
			await updateDoc(riderRef, rider);
			setLoading(false);
			alert("Rider Updated Successfully");
			navigation.navigate("Riders");
		} catch (error) {
			alert(error.message);
			console.log(error);
		}
	};
	const handleImage = async () => {
		let permissionResult =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (permissionResult.granted === false) {
			alert("Camera access is required");
			return;
		}
		// get image from gallery
		let pickerResult =
			await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 1,
			});
		if (pickerResult.canceled === true) {
			return;
		}
		const path = `Profiles/${
			state.user.category
		}/${userId}/${Date.now()}`;
		const img = await uploadImage(
			path,
			pickerResult.assets[0].uri
		);
		setUploadedImage(img);
	};
	const uploadImage = async (imageReferenceID, uri) => {
		if (uri) {
			const result = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 100, height: 100 } }],
				{
					compress: 0.5,
					format: ImageManipulator.SaveFormat.JPEG,
				}
			);
			const response = await fetch(result.uri);
			const blob = await response.blob();
			const storageRef = ref(storage, imageReferenceID);
			await uploadBytes(storageRef, blob);
			return getDownloadURL(storageRef);
		}
		return null;
	};
	return (
		<View style={styles.container}>
			<RiderForm
				detail={detail}
				error={error}
				loading={loading}
				handleImage={handleImage}
				showPassword={showPassword}
				setShowPassword={setShowPassword}
				handleChange={handleChange}
				handleSubmit={handleUpdate}
				uploadedImage={uploadedImage}
				mode="edit"
			/>
		</View>
	);
};

export default EditRider;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000",
	},
});
