import React, { Component } from "react";
import { GiftedChat, Bubble, MessageText, Time } from 'react-native-gifted-chat'
import Moment from 'moment';
import PrefManager from "../data/local/PrefManager"
import firebase from 'react-native-firebase';
import MyUtils from "../utils/MyUtils";
import { SafeAreaView } from "react-native"
import WebHandler from "../data/remote/WebHandler"

const webHandler = new WebHandler()
const prefManager = new PrefManager()
class ConversationScreen extends Component {

    constructor(props) {
        super(props)
        this.ref = null;
        this.unsubscribe = null;
        this.state = {
            myUserId: "",
            userId: props.navigation.getParam("_userId", ""),
            chatId: props.navigation.getParam("_chatId", ""),
            chatType: props.navigation.getParam("_chatType", ""),
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
        prefManager.getFirebaseDBRoot(dbRoot => {
            if (!MyUtils.isEmptyString(dbRoot)) {
                this.ref = firebase.firestore().collection('qaproject').doc(dbRoot);
                prefManager.getUserSessionData(data => {
                    this.setState({ myUserId: data.id })
                    this.loadData(data.id)
                })
            } else {
                MyUtils.showCustomAlert("Unknown Root", "Something went wrong please contact to the administrator.")
            }
        })
    }

    componentWillUnmount() {
        if (this.unsubscribe != null) {
            this.unsubscribe();
        }
    }

    loadData(myUserId) {
        this.unsubscribe = this.ref.collection(this.state.chatId)
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
                            createdAt: msg_data.createdAt != null ? msg_data.createdAt.toDate() : new Date(),
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
        webHandler.sendMessageToServer(this.state.chatType, msg.text, this.state.userId,
            (responseJson) => {
                var msg_data = {
                    text: msg.text,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    user_id: this.state.myUserId,
                    user_name: responseJson.user_name,
                    user_pic: responseJson.user_image,
                    chat_id: responseJson.chat_id
                }
                this.ref.collection(this.state.chatId).add(msg_data)
                    .then((response) => {
                        MyUtils.showSnackbar("sent", "")
                    }).catch(error => {
                        MyUtils.showSnackbar(JSON.stringify(error), "")
                    })
            }, (error) => {
                MyUtils.showSnackbar(error, "")
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
                    listViewProps={{
                        style: {
                            backgroundColor: "#F8F8F8"
                        }
                    }}
                    renderBubble={(props) => {
                        return (
                            <Bubble {...props}
                                wrapperStyle={{
                                    left: {
                                        backgroundColor: 'white',
                                    },
                                    right: {
                                        backgroundColor: '#FCEBBF',
                                    }
                                }}
                            />
                        )
                    }}
                    renderMessageText={(props) => {
                        return (
                            <MessageText {...props}
                                textStyle={{
                                    right: {
                                        color: "#000",
                                    }
                                }}
                            />
                        )
                    }}
                    renderTime={(props) => {
                        return (
                            <Time {...props}
                                textStyle={{
                                    right: {
                                        color: "#AAA"
                                    }
                                }}
                            />
                        )
                    }}
                />
            </SafeAreaView>
        );
    }

    onLoadEarlier() {
        this.setState({ isLoadingEarlier: true });
        setTimeout(() => {
            this.ref.collection(this.state.chatId)
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
                                createdAt: msg_data.createdAt != null ? msg_data.createdAt.toDate() : new Date(),
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

export default ConversationScreen;