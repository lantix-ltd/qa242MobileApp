import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import PrefManager from "../../data/local/PrefManager"
import MyUtils from "../../utils/MyUtils";
import NotificationIcon from '../../utils/NotificationIcon'
import { primaryColor } from "../../utils/AppStyles";
import Icon from 'react-native-vector-icons/Feather'
import { DrawerActions } from 'react-navigation';
import { Button } from 'react-native-elements'
import Panel from "../../utils/Panel"
import LinesAndShift from "../../utils/LinesAndShiftForm"
import Modal from "react-native-modal";
import WebHandler from "../../data/remote/WebHandler"
import firebase from 'react-native-firebase';
import { connect } from "react-redux"

const webHandler = new WebHandler()
const prefManager = new PrefManager()

class Checks extends Component {

    constructor(props) {
        super(props)
        this.state = {
            modalVisible: true,
            isLoading: false,
            refreshing: false,
            checksData: [],
            totalPages: 1,
            currentPage: 1,
            newChecks: 0, overDueChecks: 0, submittedChecks: 0,
            userRole: "",
            isError: false, errorMsg: "",
            openedCheck: "Open"
        }
    }

    componentDidMount() {
        this.setState({ isLoading: true })
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.setState({ userRole: userData.userPrimaryType })
                // if (userData.userPrimaryType != prefManager.AGENT) {
                //     this.loadDataFromServer(this.state.openedCheck)
                // }
            }
        })
        this.setUpForMessaging()
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
                this.showMessage(data.title, data.message)
                //alert(message.data.data)
                this.props.updateCounter(1)
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

    showMessage(title, msg) {
        Alert.alert(title, msg,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
        )
    }

    loadDataFromServer(checkType) {
        webHandler.getUserChecks(1, checkType, (responseJson) => {
            this.setState({
                checksData: responseJson.data,
                totalPages: responseJson.total_pages,
                newChecks: responseJson.open,
                overDueChecks: responseJson.overdue,
                submittedChecks: responseJson.complete,
                currentPage: 1,
                isLoading: false, refreshing: false
            })
            this.props.updateCounter(responseJson.total_notification)
        }, (errorMsg) => {
            MyUtils.showSnackbar(errorMsg, "")
            this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: errorMsg })
        },
            (checksData) => {
                this.setState({
                    checksData: checksData,
                    isLoading: false, refreshing: false
                })
            }
        )
    }

    handleToggle() {
        this.props.navigation.dispatch(DrawerActions.toggleDrawer())
    }

    renderLineAndShiftModal() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                // onBackdropPress={() => this.setState({ modalVisible: false })}
                onBackButtonPress={() => this.setState({
                    isLoading: false, refreshing: false, modalVisible: false,
                    isError: true, errorMsg: "Please define your Lines & Shift"
                })}
            >
                <View style={{ flex: 1, flexWrap: "wrap", padding: 5 }}>
                    <LinesAndShift
                        onSavePress={() => {
                            this.setState({ modalVisible: false })
                            this.loadDataFromServer(this.state.openedCheck)
                        }}
                    />
                </View>
            </Modal>
        )
    }

    renderQATechHeader() {
        return (
            <View style={{ flexDirection: "row", padding: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Open") }}>
                    <View style={[styles.round_new_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.newChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>NEW</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("OverDue") }}>
                    <View style={[styles.round_overdue_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginHorizontal: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.overDueChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>OVER DUE</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Completed") }}>
                    <View style={[styles.round_submitted_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.submittedChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>SUBMITTED</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderQASpecialistHeader() {
        return (
            <View style={{ flexDirection: "row", padding: 10 }}>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Open") }}>
                    <View style={[styles.round_pending_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginEnd: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.newChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>PENDING</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Completed") }}>
                    <View style={[styles.round_reviewed_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginStart: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.submittedChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>REVIEWED</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    renderQAManagerHeader() {
        return (
            <View style={{ flexDirection: "row", padding: 10 }}>
                <View style={[styles.round_pending_checks_bg, { flex: 1, alignItems: "center", justifyContent: "center", padding: 10, marginEnd: 5 }]}>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.newChecks}</Text>
                    <Text style={{ color: "#fff", fontSize: 14 }}>PENDING</Text>
                </View>
                <View style={[styles.round_reviewed_checks_bg, { flex: 1, alignItems: "center", justifyContent: "center", padding: 10, marginStart: 5 }]}>
                    <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.submittedChecks}</Text>
                    <Text style={{ color: "#fff", fontSize: 14 }}>APPROVED</Text>
                </View>
            </View>
        )
    }

    renderItem(item, index) {
        let title_color = "#A6A6A6"
        // if (item.assign_status == "OverDue") {
        //     title_color = "#EFDAA5"
        // }
        return (
            <Panel key={index}
                title={item.checkname} collapse="true"
                titleColor={title_color}
                onItemClick={() => { this.handleOnItemClick(item) }}
            >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Text style={{ paddingHorizontal: 15, fontSize: 15 }}>{item.check_desc}</Text>
                    <Button
                        title="Start"
                        onPress={() => { this.handleOnItemClick(item) }}
                        containerStyle={{ width: 100, marginTop: 5, alignSelf: "flex-end" }}
                    />
                </View>
            </Panel >
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
                    {this.renderLineAndShiftModal()}
                    {/* {this.state.userRole == prefManager.AGENT && this.renderLineAndShiftModal()} */}
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
                        <NotificationIcon navigation={this.props.navigation} />
                    </View>
                    {this.state.userRole === prefManager.EDITOR && this.renderQASpecialistHeader()}
                    {this.state.userRole === prefManager.ADMIN && this.renderQAManagerHeader()}
                    {(
                        this.state.userRole !== prefManager.EDITOR &&
                        this.state.userRole !== prefManager.ADMIN
                    ) && this.renderQATechHeader()}

                    {this.state.isLoading && MyUtils.renderLoadingView()}
                    {(!this.state.isLoading && !this.state.isError) &&
                        <View style={styles.container}>
                            {!MyUtils.isEmptyArray(this.state.checksData) &&
                                <FlatList
                                    style={{ flex: 1 }}
                                    data={this.state.checksData}
                                    renderItem={({ item, index }) => this.renderItem(item, index)}
                                    keyExtractor={(item, index) => index.toString()}
                                    onRefresh={() => this.handleRefresh()}
                                    refreshing={this.state.refreshing}
                                    onEndReached={() => this.handleLoadMore()}
                                    onEndReachedThreshold={0.2}
                                />
                            }
                            {MyUtils.isEmptyArray(this.state.checksData) &&
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
                        this.loadDataFromServer(this.state.openedCheck)
                    })}
                </View>
            </SafeAreaView>
        );
    }

    handleHeaderItemClick(type) {
        this.setState({ isLoading: true, openedCheck: type })
        this.loadDataFromServer(type)
    }

    handleOnItemClick(item) {
        prefManager.updateLastOpenedForm(item)
        if (this.state.userRole == prefManager.EDITOR || this.state.userRole == prefManager.ADMIN) {
            this.props.navigation.navigate("CheckDetailView", {
                _id: item.assign_id,
                _title: item.checkname,
                _user_type: this.state.userRole,
                _check_type: item.checktype,
                _is_user_completed: this.state.openedCheck == "Completed",
                onReload: () => { this.handleRefresh() }
            })
        } else {
            this.props.navigation.navigate(this.state.openedCheck == "Completed" ? "CheckDetailView" : "CheckDetailForm", {
                _id: item.assign_id,
                _title: item.checkname,
                _user_type: this.state.userRole,
                _check_type: item.checktype,
                _is_user_completed: this.state.openedCheck == "Completed",
                onReload: () => { this.handleRefresh() }
            })
        }
    }

    handleRefresh() {
        this.setState({ refreshing: true })
        this.loadDataFromServer(this.state.openedCheck)
    }

    handleLoadMore() {
        var page = this.state.currentPage
        page++;
        if (page <= this.state.totalPages) {
            this.setState({ refreshing: true })
            webHandler.getUserChecks(page, this.state.openedCheck, (responseJson) => {
                this.setState({
                    checksData: [...this.state.checksData, ...responseJson.data],
                    currentPage: page,
                    refreshing: false
                })
            }, (errorMsg) => {
                this.setState({ refreshing: false })
                MyUtils.showSnackbar(errorMsg, "")
            }, (checksData) => {
                this.setState({ refreshing: false })
            })
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    round_new_checks_bg: {
        backgroundColor: '#EDADC8',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_overdue_checks_bg: {
        backgroundColor: '#EFDAA5',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_submitted_checks_bg: {
        backgroundColor: '#629AE5',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_pending_checks_bg: {
        backgroundColor: '#EFDAA5',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_reviewed_checks_bg: {
        backgroundColor: '#EDADC8',
        overflow: 'hidden',
        borderRadius: 5
    },

});

const mapDispatchToProps = (dispatch) => {
    return {
        updateCounter: (counts) => dispatch({ type: 'UPDATE_NOTIFICATIONS_COUNTER', counts: counts }),
        resetCounter: () => dispatch({ type: 'RESET_NOTIFICATIONS_COUNTER' })
    }
}
export default connect(null, mapDispatchToProps)(Checks)