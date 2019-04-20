import React, { Component } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableHighlight, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';

const chatsData = [
    {
        id: "1", username: "Person1",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
    },
    {
        id: "2", username: "Person2",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
    },
    {
        id: "3", username: "Person3",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
    },
    {
        id: "4", username: "Person4",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
    },
    {
        id: "5", username: "Person5",
        user_pic: "https://centrik.in/wp-content/uploads/2017/02/user-image-.png",
    },
]

class Contact extends Component {

    constructor(props) {
        super(props)
        this.state = {
            refreshing: false
        }
    }

    componentDidMount() {

    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
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
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>{item.username}</Text>
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
        this.props.navigation.navigate("Conversation", {
            _userName: item.username,
            _userId: item.id
        })
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

export default Contact;