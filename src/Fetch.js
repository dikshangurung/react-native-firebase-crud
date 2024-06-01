import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { firebase } from "../config";

function Fetch() {
	const [users, setUsers] = useState([]);
	const todoRef = firebase.firestore().collection("newData");

	useEffect(() => {
		const unsubscribe = todoRef.onSnapshot((querySnapshot) => {
			const users = [];
			querySnapshot.forEach((doc) => {
				const { address, createdAt, description, latitude, longitude } =
					doc.data();
				users.push({
					id: doc.id,
					address,
					createdAt,
					description,
					latitude,
					longitude,
				});
			});
			setUsers(users);
		});

		// Cleanup subscription on unmount
		return () => unsubscribe();
	}, []);

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<Text style={styles.label}>Address: {item.address}</Text>
			<Text style={styles.label}>Latitude: {item.latitude}</Text>
			<Text style={styles.label}>Longitude: {item.longitude}</Text>
			<Text style={styles.label}>Description: {item.description}</Text>
			<Text style={styles.label}>
				Created At: {item.createdAt?.toDate().toString()}
			</Text>
		</View>
	);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Fetched Data</Text>
			<FlatList
				data={users}
				keyExtractor={(item) => item.id}
				renderItem={renderItem}
			/>
		</View>
	);
}

export default Fetch;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	item: {
		backgroundColor: "#f9f9f9",
		padding: 15,
		marginVertical: 8,
		borderRadius: 5,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
});
