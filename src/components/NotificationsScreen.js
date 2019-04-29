<<<<<<< HEAD
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import WebHandler from "../data/remote/WebHandler"
import MyUtils from "../utils/MyUtils";

const webHandler = new WebHandler()
class NotificationsScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            notificationsData: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
            currentPage: 1, totalPages: 1
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Notifications",
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true })
        this.loadData()
    }

    loadData() {
        webHandler.getUserNotifications(1, (responseJson) => {
            this.setState({
                notificationsData: responseJson.notifications,
                totalPages: responseJson.total_pages,
                currentPage: 1,
                refreshing: false, isLoading: false
            })
        }, (error) => {
            this.setState({ refreshing: false, isLoading: false, isError: true, errorMsg: error })
            MyUtils.showSnackbar(error, "")
        })
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.handleOnItemClick(item)}>
                <View>
                    <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
                        <Icon style={{ alignSelf: "center", justifyContent: "center" }} name="bell" size={40} color="#ccc" />
                        <View style={{ flex: 1, marginStart: 10, paddingHorizontal: 10, justifyContent: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.title}</Text>
                            <Text style={{ fontSize: 13 }} ellipsizeMode="tail" numberOfLines={2}>
                                {item.message}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ alignSelf: "flex-end", paddingHorizontal: 5 }}>{item.datetime}</Text>
                    <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isLoading && MyUtils.renderLoadingView()}

                {(!this.state.isLoading && !this.state.isError) &&
                    <FlatList
                        style={{ flex: 1 }}
                        data={this.state.notificationsData}
                        renderItem={({ item, index }) => this.renderItem(item, index)}
                        keyExtractor={(item, index) => index.toString()}
                        onRefresh={() => this.handleRefresh()}
                        refreshing={this.state.refreshing}
                        onEndReached={() => this.handleLoadMore()}
                        onEndReachedThreshold={0.5}
                    />
                }

                {this.state.isError && MyUtils.renderErrorView(this.state.errorMsg, () => {
                    this.setState({ isLoading: true, isError: false })
                    this.loadData()
                })}

            </View>
        );
    }

    handleOnItemClick(item) {
        Alert.alert(
            item.title, item.message,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
        )
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
            webHandler.getUserNotifications(page, (responseJson) => {
                this.setState({
                    notificationsData: [...this.state.notificationsData, ...responseJson.notifications],
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
        backgroundColor: 'white',
    }
});

=======
import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import WebHandler from "../data/remote/WebHandler"
import MyUtils from "../utils/MyUtils";

const webHandler = new WebHandler()
class NotificationsScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            notificationsData: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
            currentPage: 1, totalPages: 1
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Notifications",
        }
    };

    componentDidMount() {
        this.setState({ isLoading: true })
        this.loadData()
    }

    loadData() {
        webHandler.getUserNotifications(1, (responseJson) => {
            this.setState({
                notificationsData: responseJson.notifications,
                totalPages: responseJson.total_pages,
                currentPage: 1,
                refreshing: false, isLoading: false
            })
        }, (error) => {
            this.setState({ refreshing: false, isLoading: false, isError: true, errorMsg: error })
            MyUtils.showSnackbar(error, "")
        })
    }

    renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.handleOnItemClick(item)}>
                <View>
                    <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
                        <Icon style={{ alignSelf: "center", justifyContent: "center" }} name="bell" size={40} color="#ccc" />
                        <View style={{ flex: 1, marginStart: 10, paddingHorizontal: 10, justifyContent: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.title}</Text>
                            <Text style={{ fontSize: 13 }} ellipsizeMode="tail" numberOfLines={2}>
                                {item.message}
                            </Text>
                        </View>
                    </View>
                    <Text style={{ alignSelf: "flex-end", paddingHorizontal: 5 }}>{item.datetime}</Text>
                    <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this.state.isLoading && MyUtils.renderLoadingView()}

                    {(!this.state.isLoading && !this.state.isError) &&
                        <FlatList
                            style={{ flex: 1 }}
                            data={this.state.notificationsData}
                            renderItem={({ item, index }) => this.renderItem(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            onRefresh={() => this.handleRefresh()}
                            refreshing={this.state.refreshing}
                            onEndReached={() => this.handleLoadMore()}
                            onEndReachedThreshold={0.5}
                        />
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
        Alert.alert(
            item.title, item.message,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
        )
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
            webHandler.getUserNotifications(page, (responseJson) => {
                this.setState({
                    notificationsData: [...this.state.notificationsData, ...responseJson.notifications],
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
        backgroundColor: 'white',
    }
});

>>>>>>> b6a1ebb00a45edb093387e51e55ebc3e6914a0d7
export default NotificationsScreen;