import React from 'react';
import { DrawerItems } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather';
import {
    SafeAreaView, View, Image, ScrollView, Dimensions, StyleSheet,
    TouchableOpacity, TouchableHighlight, BackHandler, ActivityIndicator,
    Text, Alert
} from "react-native"
import { NavigationActions, StackActions } from 'react-navigation';
import ImagePicker from 'react-native-image-crop-picker';

// import WebHandler from '../Data/Remote/WebHandler';
// import Urls from '../Data/Remote/Routs';
import PrefManager from "../data/local/PrefManager"
import MyUtils from '../utils/MyUtils'
import { appGreyColor } from './AppStyles';

// const webHandler = new WebHandler()

const prefManager = new PrefManager()
const win = Dimensions.get('window');
const width = win.width * 70 / 100

export default class MainDrawerHeader extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isImageUploading: false,
            isLoggedIn: true,
            userId: "",
            userName: "",
            userProfilePic: null,
            userRole: ""
        }
    }

    componentDidMount() {
        prefManager.getUserProfileData(result => {
            if (result != null) {
                this.setState({
                    userId: result.id,
                    userProfilePic: result.userpic,
                    userName: result.username
                })
            }
        })
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.setState({ userRole: userData.userPrimaryType })
            }
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ height: 200 }}>
                    <Image
                        style={{ height: 200, width: width }}
                        resizeMode="stretch"
                        source={require('../assets/images/cover.png')}
                    />
                    {this.state.isLoggedIn &&
                        <View style={styles.header}>
                            {this.state.isImageUploading &&
                                <View>
                                    <ActivityIndicator size='large' color="white" />
                                </View>
                            }
                            {!this.state.isImageUploading &&
                                <View style={{ flexDirection: "row" }}>
                                    {this.loadUserProfilePic(this.state.userProfilePic)}
                                    <TouchableOpacity
                                        style={{ marginLeft: -30, marginTop: 15, padding: 5, justifyContent: "flex-end", elevation: 3 }}
                                        onPress={() => this.handleImagePicker()}
                                    >
                                        <Icon name="edit-2" style={styles.imageselector} size={15} color={appGreyColor} />
                                    </TouchableOpacity>
                                </View>
                            }
                            <Text style={{ fontSize: 22, padding: 6, color: "#FFFFFF", }}>{this.state.userName}</Text>
                        </View>
                    }
                    {this.state.isLoggedIn &&
                        <View style={styles.logout_view}>
                            <TouchableOpacity
                                style={{ padding: 10, }}
                                onPress={() => { this.logOutUser() }}
                            >
                                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}>Log Out</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    {!this.state.isLoggedIn &&
                        <View style={styles.header}>
                            <Text style={{ fontSize: 30, padding: 5, color: "#FFFFFF", fontWeight: 'bold' }}>{MyUtils.APP_NAME.toUpperCase()}</Text>
                            <Text style={{ padding: 5, marginTop: 10, color: "#FFFFFF" }}>Please login to craete a session</Text>
                        </View>
                    }
                </View>
                <ScrollView>
                    <DrawerItems {...this.props}
                        onItemPress={({ route, focused }) => {
                            if (route.key == "Quit") {
                                BackHandler.exitApp()
                            } else if (this.state.userRole != prefManager.AGENT &&
                                route.key == "LinesAndShift") {
                                MyUtils.showSnackbar("This action is not applicable.")
                            } else {
                                this.props.onItemPress({ route, focused })
                            }
                        }}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }

    async destroyUserSession() {
        prefManager.destroyUserSession()
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
        this.props.navigation.navigate('Login');
    }

    logOutUser() {
        Alert.alert(
            "Log Out", "Are you sure to log out?",
            [
                {
                    text: 'Yes', onPress: () => { this.destroyUserSession() }
                },
                {
                    text: 'No', onPress: () => { }
                },
            ]
        )
    }

    loadUserProfilePic(image) {
        if (image != undefined && image != null && image != "") {
            return this.circledImage({ uri: image })
        } else {
            return this.circledImage(require("../assets/images/user.png"))
        }
    }

    circledImage(imgPath) {
        return <TouchableHighlight
            style={{
                overflow: 'hidden',
                height: 90,
                width: 90,
                borderRadius: 160 / 2,
                elevation: 2
            }}>
            <Image
                style={{
                    height: 90,
                    width: 90,
                    borderRadius: 50,
                    backgroundColor: '#FFFFFF'
                }}
                source={imgPath}
            />
        </TouchableHighlight>
    }

    handleImagePicker() {
        Alert.alert(
            "Change Photo", "Please select an option.",
            [
                {
                    text: 'Open Camera', onPress: () => {
                        ImagePicker.openCamera({
                            cropping: true,
                            width: 300,
                            height: 400,
                            includeExif: true,
                        }).then(image => {
                            console.log('received image', image);
                            let img = { uri: image.path, width: image.width, height: image.height }
                            this.updateProfilePic(img)
                        }).catch(e => console.log(e));
                    }
                },
                {
                    text: 'Gallery', onPress: () => {
                        ImagePicker.openPicker({
                            width: 300,
                            height: 400,
                            cropping: true
                        }).then(image => {
                            console.log(image);
                            let img = { uri: image.path, width: image.width, height: image.height, mime: image.mime }
                            this.updateProfilePic(img)
                        }).catch(reason => { console.log(reason) });
                    }
                },
            ]
        )
    }

    async updateProfilePic(image) {

        this.setState({ userProfilePic: image.uri, });

        // this.setState({ isImageUploading: true })
        // let userId = this.state.session.Userid;
        // var formData = new FormData();
        // formData.append("user_id", userId)
        // formData.append("image", { uri: image.uri, name: 'ProfilePic.jpg', type: 'multipart/form-data' })

        // webHandler.Fetchrequests(Urls.ProfilePicUpdate, formData, async (responseJson) => {
        //     myUtils.showSnackbar("Profile picture updated", "green")
        //     this.setState({ isImageUploading: false, userProfilePic: responseJson.Image, urlcheck: 'live' });
        //     try {
        //         const getsession = await AsyncStorage.getItem('@Session:key');
        //         let Session = JSON.parse(getsession);
        //         if (Session != null && Session.Status && Session.Status == 'true') {
        //             Session.Userimage = responseJson.Image;
        //             try {
        //                 await AsyncStorage.setItem('@Session:key', JSON.stringify(Session));
        //             } catch (error) {
        //                 console.log(error.message);
        //             }
        //         }
        //     } catch (error) {
        //         console.log(error.message);
        //     }
        // }, (error) => {
        //     //error snackbar showing in the Webhandler class
        //     if (error == "Catcherror") {

        //     } else {

        //     }
        //     this.setState({ isImageUploading: false })
        // }, false, false)
    }
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "column",
        paddingVertical: 25,
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        zIndex: 2,
        left: 0,
        right: 0
    },
    logout_view: {
        flexDirection: "column",
        alignItems: 'flex-end',
        position: 'absolute',
        top: 0,
        zIndex: 2,
        left: 0,
        right: 0
    },
    imageselector: {
        backgroundColor: 'white',
        borderRadius: 150 / 2,
        padding: 5,
        elevation: 3
    },
})