import {
	Alert,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../config";
import React, { useState } from "react";

import { set } from "firebase/database";
function UploadMediaFile({ handleUpload, setUpImage }) {
	const [image, setImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [cameraPermissionInformation, requestPermission] =
		ImagePicker.useCameraPermissions();
	// const [pickedImage, setPickedImage] = useState();
	async function verifyPermissions() {
		if (
			cameraPermissionInformation.status ===
			ImagePicker.PermissionStatus.UNDETERMINED
		) {
			const permissionResponse = await requestPermission();
			return permissionResponse.granted;
		}
		if (
			cameraPermissionInformation.status ===
			ImagePicker.PermissionStatus.DENIED
		) {
			Alert.alert(
				"Insufficient Permissions!",
				"You need to grant camera permissions to use this app."
			);
			return false;
		}
		return true;
	}
	async function pickImage() {
		const hasPermission = await verifyPermissions();

		if (!hasPermission) {
			return;
		}

		setUploading(true); // Show loading overlay

		try {
			const [imageResult] = await Promise.all([
				ImagePicker.launchCameraAsync({
					allowsEditing: true,
					aspect: [16, 9],
					quality: 0.5,
				}),
			]);

			if (!imageResult.cancelled) {
				setImage(imageResult.assets[0].uri);
				setUpImage(imageResult.assets[0].uri);
			}
		} catch (error) {
			console.error("Error taking image or getting location:", error);
		}

		setUploading(false); // Hide loading overlay
	}
	// const pickImage = async () => {
	// 	let result = await ImagePicker.launchImageLibraryAsync({
	// 		mediaTypes: ImagePicker.MediaTypeOptions.All,
	// 		allowsEditing: true,
	// 		aspect: [4, 3],
	// 		quality: 0.5,
	// 	});
	// 	if (!result.cancelled) {
	// 		setImage(result.assets[0].uri);
	// 	}
	// 	console.log(result);
	// };
	//upload image to firebase
	// const UploadMedia = async () => {
	// 	setUploading(true);
	// 	try {
	// 		const { uri } = await FileSystem.getInfoAsync(image);
	// 		const blob = await new Promise((resolve, reject) => {
	// 			const xhr = new XMLHttpRequest();
	// 			xhr.onload = function () {
	// 				resolve(xhr.response);
	// 			};
	// 			xhr.onerror = function (e) {
	// 				console.log(e);
	// 				reject(new TypeError("Network request failed"));
	// 			};
	// 			xhr.responseType = "blob";
	// 			xhr.open("GET", uri, true);
	// 			xhr.send(null);
	// 		});
	// 		const filename = image.substring(image.lastIndexOf("/") + 5);
	// 		const ref = firebase.storage().ref().child(filename);
	// 		await ref.put(blob);
	// 		setUploading(false);
	// 		Alert.alert("Success", "Image uploaded successfully");
	// 		setImage(null);
	// 	} catch (e) {
	// 		console.log(e);
	// 		setUploading(false);
	// 	}
	// };
	return (
		<SafeAreaView>
			<TouchableOpacity
				onPress={pickImage}
				style={StyleSheet.selectButton}
			>
				<Text style={styles.buttonText}>Pick an image </Text>
			</TouchableOpacity>
			<View style={styles.imageContainer}>
				{image && (
					<Image
						source={{ uri: image }}
						style={{ width: 300, height: 300 }}
					/>
				)}
			</View>
			{/* <TouchableOpacity
				onPress={UploadMedia}
				style={StyleSheet.selectButton}
			>
				<Text style={styles.buttonText}>Upload </Text>
			</TouchableOpacity> */}
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	selectButton: {
		backgroundColor: "blue",
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: "black",
		fontSize: 20,
		textAlign: "center",
	},
	imageContainer: {
		marginTop: 30,
	},
});
export default UploadMediaFile;
