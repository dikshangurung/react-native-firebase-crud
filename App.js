// import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, ScrollView } from "react-native";
// import UploadMedia from "./src/UploadMediaFile";
import Add from "./src/Add";
import Fetch from "./src/Fetch";
export default function App() {
	return (
		<ScrollView style={styles.container}>
			<Add />
			<Fetch />
			{/* <UploadMedia /> */}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		marginVertical: 50,
		// alignItems: "center",
		// justifyContent: "center",
	},
});
