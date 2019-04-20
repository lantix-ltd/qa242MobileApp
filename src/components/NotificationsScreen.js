import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

const chatsData = [
    {
        id: "1", title: "Person1",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
        notification_msg: "Hello, This is a test notification message."
    },
    {
        id: "2", title: "Person2",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
        notification_msg: "Hello, This is a test notification message. Hello, This is a test notification message. Hello, This is a test notification message. Hello, This is a test notification message. Hello, This is a test notification message. Hello, This is a test notification message."
    },
    {
        id: "3", title: "Person3",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
        notification_msg: "Hello, This is a test notification message."
    },
    {
        id: "4", title: "Person4",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
        notification_msg: "Hello, This is a test notification message."
    },
    {
        id: "5", title: "Person5",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
        notification_msg: "Hello, This is a test notification message."
    },
]

class NotificationsScreen extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refreshing: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Notifications",
        }
    };

    componentDidMount() {

    }

    loadData() {

    }

    renderItem(item, index) {
        return (
            <TouchableOpacity onPress={() => this.handleOnItemClick(item)}>
                <View>
                    <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
                        {this.circledImage({ uri: item.user_pic })}
                        <View style={{ flex: 1, marginStart: 10, paddingHorizontal: 10, justifyContent: "center" }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.title}</Text>
                            <Text style={{ fontSize: 13 }} ellipsizeMode="tail" numberOfLines={2}>
                                {item.notification_msg}
                            </Text>
                        </View>
                    </View>
                    <View style={{ height: 1, backgroundColor: "#ccc", marginHorizontal: 5 }} />
                </View>
            </TouchableOpacity>
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
                    backgroundColor: '#FFFFFF'
                }}
                source={imgPath}
            />
        </TouchableHighlight>
    }

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{ flex: 1 }}
                    data={chatsData}
                    renderItem={({ item, index }) => this.renderItem(item, index)}
                    keyExtractor={(item, index) => index.toString()}
                    onRefresh={() => this.handleRefresh()}
                    refreshing={this.state.refreshing}
                    onEndReached={() => this.handleLoadMore()}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }

    handleOnItemClick(item) {
        Alert.alert(
            item.title, item.notification_msg,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
        )
    }

    handleRefresh() {

    }

    handleLoadMore() {

    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    }
});

export default NotificationsScreen;