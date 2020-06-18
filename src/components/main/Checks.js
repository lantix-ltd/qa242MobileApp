import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, SafeAreaView, Dimensions, ActivityIndicator } from "react-native";
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
import NetInfo from '@react-native-community/netinfo'
import LocalDBManager from "../../data/local/LocalDBManager";

const screenWidth = Dimensions.get('window').width
const webHandler = new WebHandler()
const prefManager = new PrefManager()
const localDB = new LocalDBManager()

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
            newChecks: 0, overDueChecks: 0, submittedChecks: 0, inProgressChecks: 0,
            userRole: "",
            isError: false, errorMsg: "",
            openedCheck: "Open",
            isNetworkAvailable: true,

            isOfflineFormsUploading: false,
            offlineFormsCount: 0,

            isFetchingChecksDetail: false
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
        this.setUpForInternetConnectivity()
        this.setUpForMessaging()
        this.props.navigation.addListener('willFocus', (playload) => {
            prefManager.getReloadReq(isReq => {
                if (isReq) {
                    this.setState({ isLoading: true })
                    this.loadDataFromServer(this.state.openedCheck)
                    prefManager.setReloadReq(false)
                }
            })
        })
    }

    componentWillUnmount() {
        if (this.messageListener !== undefined) {
            this.messageListener();
        }
        if (this.internetListener) {
            this.internetListener()
        }
    }

    setUpForInternetConnectivity() {
        this.internetListener = NetInfo.addEventListener(info => {
            this.setState({ isNetworkAvailable: info.isConnected })
            if (info.isConnected) {
                //MyUtils.showSnackbar("Connected", "")
                this.checkForOfflinePendingForms()
            } else {
                this.loadOfflineChecks()
            }
        })
    }

    async setUpForMessaging() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.messageListener = firebase.messaging().onMessage((message) => {
                // Process your message when app is visible to user
                var data = JSON.parse(message.data.data);
                //this.showMessage(data.title, data.message)
                //alert(message.data.data)
                if (data.is_background_task && data.title == "chat_message" && data.message == "chat_message") {
                    this.props.updateChatCounter(1)
                } else {
                    this.props.updateCounter(1)
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

    showMessage(title, msg) {
        Alert.alert(title, msg,
            [
                {
                    text: 'OK', onPress: () => { }
                }
            ]
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
                <View style={{ flex: 1, padding: 5 }}>
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
                        <Text style={{ color: "#fff", fontSize: 0.025 * screenWidth }}>NEW</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("OverDue") }}>
                    <View style={[styles.round_overdue_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginHorizontal: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.overDueChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 0.025 * screenWidth }}>OVER DUE</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Completed") }}>
                    <View style={[styles.round_submitted_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginEnd: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.submittedChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 0.025 * screenWidth }}>SUBMITTED</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("InProgress") }}>
                    <View style={[styles.round_inprogress_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.inProgressChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 0.025 * screenWidth }}>IN-PROGRESS</Text>
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
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Open") }}>
                    <View style={[styles.round_pending_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginEnd: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.newChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>PENDING</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { this.handleHeaderItemClick("Completed") }}>
                    <View style={[styles.round_reviewed_checks_bg, { alignItems: "center", justifyContent: "center", padding: 10, marginStart: 5 }]}>
                        <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 20 }}>{this.state.submittedChecks}</Text>
                        <Text style={{ color: "#fff", fontSize: 14 }}>APPROVED</Text>
                    </View>
                </TouchableOpacity>
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
                timeStamp={item.timestamp}
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

    renderDraftItem(item, index) {
        let title_color = "#A6A6A6"
        return (
            <Panel key={index}
                timeStamp={item.timestamp}
                title={item.sf_name} collapse="true"
                titleColor={title_color}
                onItemClick={() => { this.handleOnDraftItemClick(item) }}
            >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Button
                        title="Start"
                        onPress={() => { this.handleOnDraftItemClick(item) }}
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
                    {!this.state.isNetworkAvailable &&
                        <View style={{ backgroundColor: "red", justifyContent: "center", alignItems: "center" }}>
                            <Text style={{ padding: 5, color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                                No Internet Connection: Offline Mode
                            </Text>
                        </View>
                    }
                    {this.state.offlineFormsCount > 0 &&
                        <View style={{ backgroundColor: "orange", justifyContent: "center", alignItems: "center" }}>
                            {this.state.isOfflineFormsUploading &&
                                <View style={{ flexDirection: "row" }}>
                                    <Text style={{ padding: 5, color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                                        {"Uploading offline data..."}
                                    </Text>
                                    <ActivityIndicator size="small" color={"#fff"} />
                                </View>
                            }
                            {!this.state.isOfflineFormsUploading &&
                                <View style={{ flexDirection: "row", }}>
                                    <Text style={{ padding: 5, color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                                        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>
                                            {this.state.offlineFormsCount}
                                        </Text>
                                        {" offline form pending to upload."}
                                    </Text>
                                    <TouchableOpacity style={{ padding: 5 }}
                                        onPress={() => { this.uploadOfflineChecks() }}>
                                        <Icon name={"refresh-ccw"} size={20} color={"#fff"} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    }
                    {this.state.isFetchingChecksDetail &&
                        <View style={{ backgroundColor: "orange", justifyContent: "center", alignItems: "center", flexDirection: "row" }}>
                            <Text style={{ padding: 5, color: "#fff", fontSize: 12, fontWeight: "bold" }}>
                                {"Fetching checks data..."}
                            </Text>
                            <ActivityIndicator size="small" color={"#fff"} />
                        </View>
                    }
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
                                    renderItem={({ item, index }) => {
                                        if (this.state.openedCheck == "InProgress") {
                                            return this.renderDraftItem(item, index)
                                        } else {
                                            return this.renderItem(item, index)
                                        }
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                    onRefresh={() => this.handleRefresh()}
                                    refreshing={this.state.refreshing}
                                    onEndReached={() => this.handleLoadMore()}
                                    onEndReachedThreshold={0.5}
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
                    {!this.state.isLoading && this.state.isError && MyUtils.renderErrorView(this.state.errorMsg, () => {
                        this.setState({ isLoading: true, isError: false })
                        this.loadDataFromServer(this.state.openedCheck)
                    })}
                </View>
            </SafeAreaView>
        );
    }

    loadDataFromServer(checkType) {
        webHandler.getUserChecks(1, checkType, (responseJson) => {
            // this.setState({ checksData: [] })
            this.setState({
                checksData: responseJson.data,
                totalPages: responseJson.total_pages,
                newChecks: responseJson.open,
                overDueChecks: responseJson.overdue,
                submittedChecks: responseJson.complete,
                inProgressChecks: responseJson.in_progress,
                currentPage: 1,
                isLoading: false, refreshing: false
            })
            this.props.updateCounter(responseJson.total_notification)

            if (this.state.userRole == prefManager.AGENT) {
                localDB.getLastFetchedData(formData => {
                    responseJson.data.map((ch, chI) => {
                        if (formData) {
                            let oldCheckData = formData.data.find(i => i.assign_id == ch.assign_id)
                            if (oldCheckData && oldCheckData.detail) {
                                ch.detail = oldCheckData.detail
                            }
                        }
                    })
                    localDB.updateLastFetchedData(responseJson, checkType, () => {
                        this.setState({ isFetchingChecksDetail: true })
                        localDB.fetchChecksDetail(() => {
                            this.setState({ isFetchingChecksDetail: false })
                        })
                    })
                })
            }

        }, (errorMsg) => {
            MyUtils.showSnackbar(errorMsg, "")
            this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: errorMsg })
        })
    }

    loadInProgressChecks() {
        webHandler.getFixedFormsDrafts(1, (responseJson) => {
            this.setState({
                checksData: responseJson.check_array,
                totalPages: responseJson.total_pages,
                currentPage: 1,
                isLoading: false, refreshing: false
            })
        }, (errorMsg) => {
            MyUtils.showSnackbar(errorMsg, "")
            this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: errorMsg })
        })
    }

    loadOfflineChecks() {
        this.setState({ isLoading: true, checksData: [] })
        localDB.getLastFetchedData(respData => {
            this.setState({
                openedCheck: "Open",
                checksData: respData.data,
                totalPages: respData.total_pages,
                newChecks: respData.open,
                overDueChecks: respData.overdue,
                submittedChecks: respData.complete,
                inProgressChecks: respData.in_progress,
                currentPage: 1,
                isLoading: false, refreshing: false
            })
        })
        this.checkForOfflinePendingForms()
    }

    handleRefresh() {
        if (this.state.isNetworkAvailable) {
            this.setState({ refreshing: true })
            if (this.state.openedCheck == "InProgress") {
                this.loadInProgressChecks()
                return
            }
            this.loadDataFromServer(this.state.openedCheck)
        }
    }

    handleLoadMore() {
        if (this.state.isNetworkAvailable) {
            var page = this.state.currentPage
            page++;
            if (page <= this.state.totalPages) {
                this.setState({ refreshing: true })
                if (this.state.openedCheck == "InProgress") {
                    webHandler.getFixedFormsDrafts(page, (responseJson) => {
                        this.setState({
                            checksData: [...this.state.checksData, ...responseJson.check_array],
                            totalPages: responseJson.total_pages,
                            currentPage: page,
                            isLoading: false, refreshing: false
                        })
                    }, (errorMsg) => {
                        MyUtils.showSnackbar(errorMsg, "")
                        this.setState({ isLoading: false, refreshing: false, isError: true, errorMsg: errorMsg })
                    })
                } else {
                    webHandler.getUserChecks(page, this.state.openedCheck, (responseJson) => {
                        this.setState({
                            checksData: [...this.state.checksData, ...responseJson.data],
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
    }

    handleHeaderItemClick(type) {
        if (this.state.isNetworkAvailable) {
            this.setState({ isLoading: true, openedCheck: type })
            if (type == "InProgress") {
                this.loadInProgressChecks()
            } else {
                this.loadDataFromServer(type)
            }
        } else {
            this.loadOfflineChecks()
            MyUtils.showSnackbar("Not Connected: Offline Mode")
        }
    }

    handleOnItemClick(item) {
        if (this.state.userRole == prefManager.EDITOR || this.state.userRole == prefManager.ADMIN) {
            this.props.navigation.navigate("CheckDetailView", {
                _id: item.assign_id,
                _title: item.checkname,
                _user_type: this.state.userRole,
                _check_type: item.checktype,
                _is_user_completed: this.state.openedCheck == "Completed",
                onReload: () => { this.handleHeaderItemClick("Open") }
            })
        } else {
            this.props.navigation.navigate(this.state.openedCheck == "Completed" ? "CheckDetailView" : "CheckDetailForm", {
                _id: item.assign_id,
                _title: item.checkname,
                _user_type: this.state.userRole,
                _check_type: item.checktype,
                _is_user_completed: this.state.openedCheck == "Completed",
                _check_detail: this.state.openedCheck == "Completed" ? null : item.detail,
                onReload: () => { this.handleHeaderItemClick("Open") }
            })
        }
    }

    handleOnDraftItemClick(item) {
        this.props.navigation.navigate("FormDetail", {
            _formId: item.sd_check_id,
            _assignId: item.sd_id,
            _formName: item.sf_name,
            _isDraft: true,
            onReload: () => { this.handleHeaderItemClick("Open") }
        })
    }

    checkForOfflinePendingForms() {
        localDB.getLocalPendingFormsData(data => {
            if (data && data != null) {
                this.setState({
                    offlineFormsCount: data.length
                })
            }
        })
    }

    uploadOfflineChecks() {
        localDB.getLocalPendingFormsData(data => {

            if (data && data != null) {

                console.log(JSON.stringify(data))

                let formsCount = data.length
                if (formsCount == 0) {
                    return
                }
                this.setState({ isOfflineFormsUploading: true })
                var uploadPromises = []
                data.map((checkData, indx) => {
                    var p = new Promise((resolve, reject) => {
                        webHandler.submitCheck(checkData.checkId, checkData.checkTitle,
                            checkData.quesResp, checkData.PTypes,
                            (responseJson) => {
                                if (!MyUtils.isEmptyArray(checkData.mediaFiles)) {
                                    resolve("Form " + (indx + 1) + " uploaded")
                                } else {
                                    localDB.removeFromPendingFormsData(checkData.checkId, () => {
                                        resolve("Form " + (indx + 1) + " uploaded")
                                    })
                                }
                            }, error => {
                                MyUtils.showSnackbar(error, "red")
                                reject(new Error(error))
                            }
                        )
                    })
                    uploadPromises.push(p)
                })

                Promise.all(uploadPromises).then(result => {
                    if (result.length == formsCount) {
                        this.uploadCheckMedia()
                    } else {
                        MyUtils.showSnackbar("Unable to upload all data, try again", "red")
                        this.setState({ isOfflineFormsUploading: false })
                    }
                }).catch(error => {
                    MyUtils.showSnackbar("Unable to upload all data, try again", "red")
                    this.setState({ isOfflineFormsUploading: false })
                })

            }
        })
    }

    uploadCheckMedia() {
        localDB.getLocalPendingFormsData(data => {
            if (data && data != null) {
                let formsCount = data.length
                if (formsCount == 0) {
                    MyUtils.showSnackbar("All data uploaded successfully", "green")
                    this.setState({ isOfflineFormsUploading: false, offlineFormsCount: 0 })
                    this.loadDataFromServer("Open")
                    return
                }
                this.setState({ isOfflineFormsUploading: true })
                MyUtils.showSnackbar("Uploading media files...", "")
                var uploadPromises = []
                data.map((checkData, indx) => {
                    var p = new Promise((resolve, reject) => {
                        var uploadPromises2 = []
                        checkData.mediaFiles.map((item, indx2) => {
                            var p2 = new Promise((resolve2, reject2) => {
                                webHandler.uploadCheckMedia(checkData.checkId, item.file.uri, item.type, (responseJson) => {
                                    resolve2("File " + (indx2 + 1) + " uploaded")
                                }, (error) => {
                                    reject2(new Error(error))
                                })
                            })
                            uploadPromises2.push(p2)
                        })
                        Promise.all(uploadPromises2).then(result => {
                            if (checkData.mediaFiles.length == result.length) {
                                localDB.removeFromPendingFormsData(checkData.checkId, () => {
                                    resolve("Form " + (indx + 1) + " media uploaded")
                                })
                            } else {
                                reject(new Error("Unable to uplaod form " + (indx + 1) + " media files"))
                            }
                        }).catch(error => { reject(error) })

                    })
                    uploadPromises.push(p)
                })

                Promise.all(uploadPromises).then(result => {
                    if (result.length == formsCount) {
                        MyUtils.showSnackbar("All data uploaded successfully", "green")
                        this.setState({ isOfflineFormsUploading: false, offlineFormsCount: 0 })
                        this.loadDataFromServer("Open")
                    } else {
                        MyUtils.showSnackbar("Unable to upload all data, try again", "red")
                        this.setState({ isOfflineFormsUploading: false })
                    }
                }).catch(error => {
                    MyUtils.showSnackbar("Unable to upload all data, try again", "red")
                    this.setState({ isOfflineFormsUploading: false })
                })
            }
        })

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
        backgroundColor: '#b6e2b6',
        overflow: 'hidden',
        borderRadius: 5
    },
    round_inprogress_checks_bg: {
        backgroundColor: '#A3C1E8',
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
        resetCounter: () => dispatch({ type: 'RESET_NOTIFICATIONS_COUNTER' }),
        updateChatCounter: (counts) => dispatch({ type: 'UPDATE_CHAT_MSG_COUNTER', chat_counter: counts }),
    }
}
export default connect(null, mapDispatchToProps)(Checks)