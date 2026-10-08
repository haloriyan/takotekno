import * as Notifications from "expo-notifications";
import { navigationRef } from "./navigation";
import LocalStore from "../LocalStore";

const handleNotificationResponse = response => {
	const data = response?.notification?.request?.content?.data;
	console.log("FROM NOTIF HANDLER");
	
	console.log(data);

	LocalStore.setItem('pending_notif', data);
    
	// navigationRef.navigate(data.screen, data.params);
};

export const setupNotificationNavigation = () => {
	const subscription =
		Notifications.addNotificationResponseReceivedListener(
			handleNotificationResponse
		);

	return () => subscription.remove();
};