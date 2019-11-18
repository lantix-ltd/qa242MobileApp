import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';
import WebHandler from "../../data/remote/WebHandler"
import firebase from 'react-native-firebase';
import { connect } from "react-redux"

const webHandler = new WebHandler()
class Chats extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chatHistoryData: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
            isFirstLoaded: false
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('willFocus', async (playload) => {
            if (this.state.isFirstLoaded) {
                this.loadData()
            }
        })
        this.setUpForMessaging()
        this.setState({ isLoading: true, isFirstLoaded: true })
        this.loadData()
    }

    componentWillUnmount() {
        if (this.messageListener !== undefined) {
            this.messageListener();
        }
    }

    async setUpForMessaging() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.messageListener = firebase.messaging().onMessage((message) => {
                // Process your message when app is visible to user
                var data = JSON.parse(message.data.data);
                if (data.is_background_task && data.title == "chat_message" && data.message == "chat_message") {
                    this.loadData()
                }
            });
        } else {
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                this.setUpForMessaging()
            } catch (error) {
                // User has rejected permissions
                alert("You may not receive any push notifications.")
            }
        }
    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    loadData() {
        webHandler.getUserChatHistory((responseJson) => {
            this.setState({
                chatHistoryData: responseJson.left_panel,
                refreshing: false, isLoading: false
            })
            this.props.updateChatCounter(responseJson.total_counter)
        }, (error) => {
            this.setState({ refreshing: false, isLoading: false, isError: true, errorMsg: error })
            MyUtils.showSnackbar(error, "")
        })
    }

    renderItem(item, index) {
        return (
            <View style={[styles.round_white_bg, { marginHorizontal: 10, marginBottom: 10 }]}>
                <TouchableOpacity onPress={() => this.handleOnItemClick(item)}>
                    <View>
                        <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
                            {this.circledImage({ uri: item.image })}
                            <View style={{ flex: 1, marginStart: 10, paddingHorizontal: 10, justifyContent: "center" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ fontWeight: "bold", marginEnd: 5 }}>{item.name}</Text>
                                    {(item.type == "user" && item.is_online) &&
                                        <View style={{ alignItems: "center", justifyContent: "center" }}>
                                            <Icon name="circle" style={{ marginTop: 3 }} size={14} color="green" />
                                        </View>
                                    }
                                </View>
                                <Text>{item.last_message}</Text>
                            </View>

                            {(item.counter > 0) &&
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <View style={{ padding: 5, borderRadius: 150 / 2, backgroundColor: primaryColor, minWidth: 25 }}>
                                        <Text style={{ fontSize: 12, fontWeight: "bold", color: "#fff", textAlign: "center" }}>{item.counter}</Text>
                                    </View>
                                </View>
                            }

                            {/* {(item.type == "user" && item.is_online) &&
                                <View style={{ alignItems: "center", justifyContent: "center" }}>
                                    <Icon name="circle" style={{ marginTop: 3 }} size={14} color="green" />
                                </View>
                            } */}

                            {/* <View style={{ alignItems: "center", justifyContent: "center" }}>
                            <Text >{item.online_time}</Text>
                            {item.online &&
                                <Icon name="circle" style={{ marginTop: 3 }} size={14} color="green" />
                            }
                            </View> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    circledImage(imgPath) {
        return <TouchableHighlight
            style={{
                overflow: 'hidden',
                height: 50,
                width: 50,
                borderRadius: 100 / 2,
                elevation: 2
            }}>
            <Image
                style={{
                    height: 50,
                    width: 50,
                    borderRadius: 50,
                    backgroundColor: '#CCCCCC'
                }}
                source={imgPath}
            />
        </TouchableHighlight>
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={{ padding: 5, height: 60, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: primaryColor }}>
                        <TouchableOpacity
                            style={{ padding: 10, }}
                            onPress={() => this.handleToggle()}>
                            <Icon name="menu" size={20} color={"#fff"} />
                        </TouchableOpacity>
                        <Text
                            style={{ color: "#fff", fontSize: 16, marginLeft: 10, }}>
                            {MyUtils.APP_NAME}
                        </Text>
                        <View style={{ flex: 1 }} />
                    </View>
                    {this.state.isLoading && MyUtils.renderLoadingView()}
                    {(!this.state.isLoading && !this.state.isError) &&
                        <View style={[styles.container, { marginTop: 10 }]}>
                            {!MyUtils.isEmptyArray(this.state.chatHistoryData) &&
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.chatHistoryData}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                    onRefresh={() => this.handleRefresh()}
                                    refreshing={this.state.refreshing}
                                    onEndReached={() => this.handleLoadMore()}
                                    onEndReachedThreshold={0.5}
                                />
                            }
                            {MyUtils.isEmptyArray(this.state.chatHistoryData) &&
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Text style={{ alignSelf: "center", fontSize: 16 }}>No checks found</Text>
                                </View>
                            }
                        </View>
                    }
                    {this.state.isError && MyUtils.renderErrorView(this.state.errorMsg, () => {
                        this.setState({ isLoading: true, isError: false })
                        this.loadData()
                    })}

                </View>
            </SafeAreaView>
        );
    }

    handleOnItemClick(item) {
        this.props.navigation.navigate("Conversation", {
            _userName: item.name,
            _userId: item.id,
            _chatId: item.trackig_id,
            _chatType: item.type,
            _unreadMsgCount: item.counter
        })
    }

    handleRefresh() {
        this.setState({ refreshing: true, })
        this.loadData()
    }

    handleLoadMore() {

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    round_white_bg: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: 10
    },
});

const mapDispatchToProps = (dispatch) => {
    return {
        updateChatCounter: (counts) => dispatch({ type: 'UPDATE_CHAT_MSG_COUNTER', chat_counter: counts }),
        resetChatCounter: () => dispatch({ type: 'RESET_CHAT_MSG_COUNTER' })
    }
}
export default connect(null, mapDispatchToProps)(Chats)