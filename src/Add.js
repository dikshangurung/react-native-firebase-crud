import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	Keyboard,
} from "react-native";
import { firebase } from "../config";
import UploadMediaFile from "./UploadMediaFile";
import * as FileSystem from "expo-file-system";
const Add = () => {
	const [address, setAddress] = useState("");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [description, setDescription] = useState("");
	const [upImage, setUpImage] = useState(null);
	const [uploading, setUploading] = useState(false);
	//firebase
	const todoRef = firebase.firestore().collection("newData");
	// const [addData, setAddData] = useState("");
	//add a new field
	const addField = async () => {
		//check if we have new field data

		//get the timestamp
		const timestamp = firebase.firestore.FieldValue.serverTimestamp();
		let imageUrl = "";
		if (upImage) {
			setUploading(true);
			imageUrl = await uploadImage(upImage);
			// console.log(imageUrl);
			setUploading(false);
		}
		const data = {
			address: address,
			imageUrl: imageUrl,
			latitude: latitude,
			longitude: longitude,
			description: description,
			createdAt: timestamp,
		};
		todoRef
			.add(data)
			.then(() => {
				//release the new field state
				setAddress("");
				setLatitude("");
				setLongitude("");
				setDescription("");
				//release keyboard
				Keyboard.dismiss();
			})
			.catch((error) => {
				console.log(error);
			});
	};
	//Upload images
	const uploadImage = async (uri) => {
		const response = await fetch(uri);
		const blob = await response.blob();
		const filename = uri.substring(uri.lastIndexOf("/") + 1);
		const ref = firebase.storage().ref().child(filename);

		const snapshot = await ref.put(blob);
		const downloadURL = await snapshot.ref.getDownloadURL();
		return downloadURL;
	};
	const UploadMedia = async () => {
		setUploading(true);
		try {
			const { uri } = await FileSystem.getInfoAsync(upImage);
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (e) {
					console.log(e);
					reject(new TypeError("Network request failed"));
				};
				xhr.responseType = "blob";
				xhr.open("GET", uri, true);
				xhr.send(null);
			});
			const filename = upImage.substring(upImage.lastIndexOf("/") + 5);
			const ref = firebase.storage().ref().child(filename);
			await ref.put(blob);
			setUploading(false);
			Alert.alert("Success", "Image uploaded successfully");
			setUpImage(null);
		} catch (e) {
			console.log(e);
			setUploading(false);
		}
	};
	const handleSubmit = () => {
		if (!address || !latitude || !longitude || !description) {
			Alert.alert("Error", "All fields are required!");
			return;
		}

		// Log the values (replace this with your database logic)
		console.log({
			address,
			latitude,
			longitude,
			description,
		});
		addField();
		UploadMedia();
		// Clear the input fields
		setAddress("");
		setLatitude("");
		setLongitude("");
		setDescription("");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.label}>Address:</Text>
			<TextInput
				style={styles.input}
				value={address}
				onChangeText={setAddress}
			/>
			<Text style={styles.label}>Latitude:</Text>
			<TextInput
				style={styles.input}
				value={latitude}
				onChangeText={setLatitude}
				keyboardType="numeric"
			/>
			<Text style={styles.label}>Longitude:</Text>
			<TextInput
				style={styles.input}
				value={longitude}
				onChangeText={setLongitude}
				keyboardType="numeric"
			/>
			<Text style={styles.label}>Description:</Text>
			<TextInput
				style={styles.input}
				value={description}
				onChangeText={setDescription}
			/>
			<UploadMediaFile
				handleUpload={UploadMedia}
				setUpImage={setUpImage}
			/>
			<Button title="Submit" onPress={handleSubmit} />
		</View>
	);
};

export default Add;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	label: {
		fontSize: 18,
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 8,
		marginBottom: 16,
		borderRadius: 4,
	},
});
