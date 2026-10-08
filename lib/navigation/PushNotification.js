import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";

export const PushNotifications = async () => {
	if (!Constants.isDevice) {
		// console.log("Push notifications require a physical device");
		// return null;
	}

	const { status: existingStatus } =
		await Notifications.getPermissionsAsync();

	let status = existingStatus;

	if (status !== "granted") {
		const { status: requestedStatus } =
			await Notifications.requestPermissionsAsync();

		status = requestedStatus;
	}

	if (status !== "granted") {
		console.log("Notification permission denied");
		return null;
	}

	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
		});
	}

	const projectId =
		Constants.expoConfig?.extra?.eas?.projectId ??
		Constants.easConfig?.projectId;

	if (!projectId) {
		throw new Error("EAS projectId is missing");
	}

	const { data: pushToken } =
		await Notifications.getExpoPushTokenAsync({
			projectId,
		});

	return pushToken;
};