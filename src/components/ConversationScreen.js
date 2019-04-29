<<<<<<< HEAD
import React, { Component } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import Moment from 'moment';
import PrefManager from "../data/local/PrefManager"
import firebase from 'react-native-firebase';
import MyUtils from "../utils/MyUtils";
import { SafeAreaView } from "react-native"

const prefManager = new PrefManager()
class ConversationScreen extends Component {

    constructor(props) {
        super(props)
        this.ref = firebase.firestore().collection('qaproject').doc("users_chats");
        this.unsubscribe = null;
        this.state = {
            myUserId: "",
            userId: props.navigation.getParam("_userId", ""),
            messages: [],
            loadEarlier: false,
            isLoadingEarlier: false,
            isAllMessagesLoaded: false,
            lastLoadedDoc: null
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('_userName'),
        }
    };

    componentDidMount() {
        prefManager.getUserSessionData(data => {
            this.setState({ myUserId: data.id })
            this.loadData(data.id)
        })
    }

    componentWillUnmount() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }

    loadData(myUserId) {
        this.unsubscribe = this.ref.collection("jahanzaib_ramzan")
            .orderBy("createdAt", "desc")
            .limit(10)
            .onSnapshot((querySnapshot) => {
                var _messages = []
                var size = querySnapshot.docs.length
                if (size > 0) {
                    if (size == 10) {
                        this.setState({ lastLoadedDoc: querySnapshot.docs[size - 1], loadEarlier: true })
                    }
                    querySnapshot.forEach((doc) => {
                        var msg_data = doc.data()
                        var msg = {
                            _id: doc.id,
                            text: msg_data.text,
                            createdAt: Moment(msg_data.createdAt).toDate(),
                            user: {
                                _id: msg_data.user_id,
                                name: msg_data.user_name,
                                avatar: msg_data.user_pic,
                            }
                        }
                        _messages.push(msg)
                    })
                }
                this.setState({ messages: _messages })
            })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        this.sendMessageToServer(messages[0])
    }

    sendMessageToServer(msg) {
        var msg_data = {
            text: msg.text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user_id: this.state.myUserId,
            user_name: "Jahanzaib Ramzan",
            user_pic: "https://placeimg.com/140/140/any"
        }
        this.ref.collection("jahanzaib_ramzan").add(msg_data)
            .then((response) => {
                MyUtils.showSnackbar("sent", "")
            }).catch(error => {
                MyUtils.showSnackbar(JSON.stringify(error), "")
            })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{ _id: this.state.myUserId, }}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={() => this.onLoadEarlier()}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                />
            </SafeAreaView>
        );
    }

    onLoadEarlier() {
        this.setState({ isLoadingEarlier: true });
        setTimeout(() => {
            this.ref.collection("jahanzaib_ramzan")
                .orderBy("createdAt", "desc")
                .startAfter(this.state.lastLoadedDoc)
                .limit(10)
                .get()
                .then((querySnapshot) => {
                    var _messages = []
                    var size = querySnapshot.docs.length
                    if (size > 0) {
                        this.setState({ lastLoadedDoc: querySnapshot.docs[size - 1] })
                        querySnapshot.forEach((doc) => {
                            var msg_data = doc.data()
                            var msg = {
                                _id: doc.id,
                                text: msg_data.text,
                                createdAt: Moment(msg_data.createdAt).toDate(),
                                user: {
                                    _id: msg_data.user_id,
                                    name: msg_data.user_name,
                                    avatar: msg_data.user_pic,
                                }
                            }
                            _messages.push(msg)
                        })
                        this.setState((previousState) => {
                            return {
                                messages: GiftedChat.prepend(previousState.messages, _messages),
                                isLoadingEarlier: false,
                            };
                        });
                    } else {
                        this.setState((previousState) => {
                            return {
                                messages: GiftedChat.prepend(previousState.messages, _messages),
                                loadEarlier: false,
                                isLoadingEarlier: false,
                            };
                        });
                    }
                }).catch(error => {
                    alert(JSON.stringify(error))
                })
        }, 1000); // simulating network
    }

}

=======
import React, { Component } from "react";
import { GiftedChat } from 'react-native-gifted-chat'
import Moment from 'moment';
import PrefManager from "../data/local/PrefManager"
import firebase from 'react-native-firebase';
import MyUtils from "../utils/MyUtils";
import { SafeAreaView } from "react-native"

const prefManager = new PrefManager()
class ConversationScreen extends Component {

    constructor(props) {
        super(props)
        this.ref = firebase.firestore().collection('qaproject').doc("users_chats");
        this.unsubscribe = null;
        this.state = {
            myUserId: "",
            userId: props.navigation.getParam("_userId", ""),
            messages: [],
            loadEarlier: false,
            isLoadingEarlier: false,
            isAllMessagesLoaded: false,
            lastLoadedDoc: null
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('_userName'),
        }
    };

    componentDidMount() {
        prefManager.getUserSessionData(data => {
            this.setState({ myUserId: data.id })
            this.loadData(data.id)
        })
    }

    componentWillUnmount() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }

    loadData(myUserId) {
        this.unsubscribe = this.ref.collection("jahanzaib_ramzan")
            .orderBy("createdAt", "desc")
            .limit(10)
            .onSnapshot((querySnapshot) => {
                var _messages = []
                var size = querySnapshot.docs.length
                if (size > 0) {
                    if (size == 10) {
                        this.setState({ lastLoadedDoc: querySnapshot.docs[size - 1], loadEarlier: true })
                    }
                    querySnapshot.forEach((doc) => {
                        var msg_data = doc.data()
                        var msg = {
                            _id: doc.id,
                            text: msg_data.text,
                            createdAt: Moment(msg_data.createdAt).toDate(),
                            user: {
                                _id: msg_data.user_id,
                                name: msg_data.user_name,
                                avatar: msg_data.user_pic,
                            }
                        }
                        _messages.push(msg)
                    })
                }
                this.setState({ messages: _messages })
            })
    }

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
        this.sendMessageToServer(messages[0])
    }

    sendMessageToServer(msg) {
        var msg_data = {
            text: msg.text,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            user_id: this.state.myUserId,
            user_name: "Jahanzaib Ramzan",
            user_pic: "https://placeimg.com/140/140/any"
        }
        this.ref.collection("jahanzaib_ramzan").add(msg_data)
            .then((response) => {
                MyUtils.showSnackbar("sent", "")
            }).catch(error => {
                MyUtils.showSnackbar(JSON.stringify(error), "")
            })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={messages => this.onSend(messages)}
                    user={{ _id: this.state.myUserId, }}
                    loadEarlier={this.state.loadEarlier}
                    onLoadEarlier={() => this.onLoadEarlier()}
                    isLoadingEarlier={this.state.isLoadingEarlier}
                />
            </SafeAreaView>
        );
    }

    onLoadEarlier() {
        this.setState({ isLoadingEarlier: true });
        setTimeout(() => {
            this.ref.collection("jahanzaib_ramzan")
                .orderBy("createdAt", "desc")
                .startAfter(this.state.lastLoadedDoc)
                .limit(10)
                .get()
                .then((querySnapshot) => {
                    var _messages = []
                    var size = querySnapshot.docs.length
                    if (size > 0) {
                        this.setState({ lastLoadedDoc: querySnapshot.docs[size - 1] })
                        querySnapshot.forEach((doc) => {
                            var msg_data = doc.data()
                            var msg = {
                                _id: doc.id,
                                text: msg_data.text,
                                createdAt: Moment(msg_data.createdAt).toDate(),
                                user: {
                                    _id: msg_data.user_id,
                                    name: msg_data.user_name,
                                    avatar: msg_data.user_pic,
                                }
                            }
                            _messages.push(msg)
                        })
                        this.setState((previousState) => {
                            return {
                                messages: GiftedChat.prepend(previousState.messages, _messages),
                                isLoadingEarlier: false,
                            };
                        });
                    } else {
                        this.setState((previousState) => {
                            return {
                                messages: GiftedChat.prepend(previousState.messages, _messages),
                                loadEarlier: false,
                                isLoadingEarlier: false,
                            };
                        });
                    }
                }).catch(error => {
                    alert(JSON.stringify(error))
                })
        }, 1000); // simulating network
    }

}

>>>>>>> b6a1ebb00a45edb093387e51e55ebc3e6914a0d7
export default ConversationScreen;