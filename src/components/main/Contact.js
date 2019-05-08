import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';
import WebHandler from "../../data/remote/WebHandler"

const webHandler = new WebHandler()
class Contact extends Component {

    constructor(props) {
        super(props)
        this.state = {
            usersData: [],
            groupsData: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
            currentPage: 1, totalPages: 1
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        this.loadData()
    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    loadData() {
        webHandler.getAllUsersContacts(1, (responseJson) => {
            this.setState({
                usersData: responseJson.user_list,
                groupsData: responseJson.group_list,
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
                            <Text style={{ alignSelf: "center", fontSize: 15, marginEnd: 10 }}>
                                {("0" + (index + 1)).slice(-2)}.
                            </Text>
                            {this.circledImage({ uri: item.image })}
                            <View style={{ flex: 1, marginStart: 10, paddingHorizontal: 10, justifyContent: "center" }}>
                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.name}</Text>
                            </View>
                        </View>
                        {/* <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} /> */}
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
                        <View style={{ flex: 1 }}>

                            <View style={{ padding: 5 }}>
                                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Groups:</Text>
                                <FlatList
                                    data={this.state.groupsData}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>

                            <View style={{ flex: 1, padding: 5 }}>
                                <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Members:</Text>
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.usersData}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>

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
        var page = this.state.currentPage
        page++;
        if (page <= this.state.totalPages) {
            this.setState({ refreshing: true })
            webHandler.getAllUsersContacts(page, (responseJson) => {
                this.setState({
                    notificationsData: [...this.state.usersData, ...responseJson.user_list],
                    currentPage: page,
                    refreshing: false
                })
            }, (errorMsg) => {
                this.setState({ refreshing: false })
                MyUtils.showSnackbar(errorMsg, "")
            })
        }
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

export default Contact;