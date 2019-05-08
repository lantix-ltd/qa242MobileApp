import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';
import WebHandler from "../../data/remote/WebHandler"

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

        this.setState({ isLoading: true, isFirstLoaded: true })
        this.loadData()
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
                                <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                                <Text>{item.last_message}</Text>
                            </View>
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
                        <View style={styles.container}>
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

export default Chats;