import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification } from 'react-native-firebase';
import { ToastAndroid } from 'react-native';

// Process your message when app is not visible to user - android only
export default async (message: RemoteMessage) => {
    var data = JSON.parse(message.data.data);

    const notification = new firebase.notifications.Notification()
        .android.setChannelId("test-channel")
        .android.setDefaults(firebase.notifications.Android.Defaults.All)
        .android.setTicker(data.message)
        // .android.setLargeIcon("https://pbs.twimg.com/profile_images/992631084323131392/NkVIgs_4_400x400.jpg")
        // .android.setBigPicture("https://pbs.twimg.com/profile_images/992631084323131392/NkVIgs_4_400x400.jpg")
        .setNotificationId('notificationId')
        .setTitle(data.title)
        .setBody(data.message);

    // Build a channel
    const channel = new firebase.notifications.Android.Channel(
        'test-channel', 'Test Channel',
        firebase.notifications.Android.Importance.Max)
        .setDescription('My apps test channel');
    // Create the channel
    firebase.notifications().android.createChannel(channel).then(() => {
        firebase.notifications().displayNotification(notification)
    });
    return Promise.resolve();
}