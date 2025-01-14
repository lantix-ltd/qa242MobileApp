
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import MyUtils from "../../utils/MyUtils";
import { primaryColor } from "../../utils/AppStyles";
import { DrawerActions } from 'react-navigation';
import PrefManager from "../../data/local/PrefManager"
import WebHandler from '../../data/remote/WebHandler'

const webHandler = new WebHandler()

class InputForms extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inputForms: [],
            isLoading: false, refreshing: false, isError: false, errorMsg: "",
        }
    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        webHandler.getFixedChecksList((responseJson) => {
            this.setState({ inputForms: responseJson.static_form, isLoading: false })
        }, (error) => {
            this.setState({ isLoading: false })
            MyUtils.showSnackbar(error, "")
        })
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
                        <View style={[styles.container]}>
                            {!MyUtils.isEmptyArray(this.state.inputForms) &&
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.inputForms}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                // onRefresh={() => this.handleRefresh()}
                                // refreshing={this.state.refreshing}
                                // onEndReached={() => this.handleLoadMore()}
                                // onEndReachedThreshold={0.5}
                                />
                            }
                            {MyUtils.isEmptyArray(this.state.inputForms) &&
                                <View style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <Text style={{ alignSelf: "center", fontSize: 16 }}>No forms for you</Text>
                                </View>
                            }
                        </View>
                    }
                </View>
            </SafeAreaView>
        );
    }

    renderItem(item, index) {
        return (
            <View style={[styles.round_white_bg, { padding: 10, margin: 10, }]}>
                <TouchableOpacity onPress={() => this.openFormDetail(item)}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ alignSelf: "center", fontSize: 17, fontWeight: "bold", marginEnd: 10 }}>
                            {("0" + (index + 1)).slice(-2)}.
                            </Text>
                        <Text style={{ fontSize: 17 }}> {item.check_name}</Text>
                    </View>

                </TouchableOpacity>
            </View>
        )
    }

    openFormDetail(item) {
        this.props.navigation.navigate("FormDetail", {
            _formId: item.check_id,
            _formName: item.check_name
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    round_white_bg: {
        backgroundColor: '#ffffff',
        overflow: 'hidden',
        borderRadius: 10
    }
});

export default InputForms;