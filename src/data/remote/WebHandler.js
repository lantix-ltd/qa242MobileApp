import PrefManager from '../local/PrefManager'
import Urls from "./Urls"
import LocalDBManager from "../local/LocalDBManager"

import CryptoJS from "crypto-js"

const API_KEY = "3ec00dddc00e1dec3115457b0e317c9fb1c34db2";
const prefManager = new PrefManager();
const localDB = new LocalDBManager()

export default class WebHandler {

    constructor() {

    }

    loginUser(userName, password, fcmToken, onSuccess, onFailure) {
        var body = "user_name=" + userName + "&password=" + password
            + "&fcm_token=" + fcmToken + "&api_key=" + API_KEY
        this.sendSimplePostFormRequest(Urls.LOGIN_URL, body,
            (responseJson) => {
                if (responseJson.status == true) {
                    var data = responseJson.data
                    var primaryRole = ""
                    var secondaryRole = ""
                    var primaryGId = ""
                    var secondaryGId = ""
                    data.groups.map((item, index) => {
                        if (item.status == "1" && item.primary == true) {
                            primaryRole = item.role != undefined ? item.role : ""
                            primaryGId = item.id
                        } else if (item.status == "1" && item.primary == false) {
                            secondaryRole = item.role != undefined ? item.role : ""
                            secondaryGId = item.id
                        }
                    })
                    var userData = {
                        userId: data.user_id,
                        userName: data.name,
                        picPath: data.user_image,
                        userFName: data.first_name,
                        userLName: data.last_name,
                        userMobNo: data.cell_phone,
                        primary_type: primaryRole,
                        primary_gid: primaryGId,
                        secondary_type: secondaryRole,
                        secondary_gid: secondaryGId,
                        businessId: data.outlet_id,
                    }
                    prefManager.createNewUserSession(userData, data.token)
                    onSuccess(responseJson)
                } else {
                    onFailure(responseJson.message)
                }
            }, (error) => {
                onFailure(error)
            });
    }

    getUserChecks(onSuccess, onFailure, onOffLineData) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&role=" + userData.userPrimaryType +
                    "&group_id=" + userData.userPrimaryGId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.CHECKS_LIST_URL, body, (responseJson) => {
                    if (responseJson.status) {
                        localDB.addNewChecks(responseJson.data)
                        onSuccess(responseJson)
                    } else {
                        onFailure(responseJson.message)
                    }
                }, (error) => {
                    localDB.getAllChecks(
                        checksData => {
                            onOffLineData(checksData)
                        },
                        dbError => {
                            onFailure(error)
                        }
                    )
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    getCheckListDetail(assignId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "assign_id=" + assignId +
                    "&user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&role=" + userData.userPrimaryType +
                    "&group_id=" + userData.userPrimaryGId +
                    "&session_token=" + userData.sessionToken + "&api_key=" + API_KEY
                this.sendSimplePostFormRequest(Urls.CHECK_LIST_DETAIL_URL, body, (responseJson) => {
                    if (responseJson.status) {
                        onSuccess(responseJson)
                    } else {
                        onFailure(responseJson.message)
                    }
                }, (error) => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitCheck(assignId, assignName, quesResp, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((line, shift) => {
                    var body =
                        "assign_id=" + assignId +
                        "&assign_name=" + assignName +
                        "&ques_response=" + quesResp +
                        "&line_no=" + line +
                        "&shift_no=" + shift +
                        "&user_id=" + userData.id +
                        "&outlet_id=" + userData.businessId +
                        "&session_token=" + userData.sessionToken

                    this.sendSimplePostFormRequest(Urls.SUBMIT_CHECK_URL, body, (responseJson) => {
                        if (responseJson.status) {
                            onSuccess(responseJson)
                        } else {
                            onFailure(responseJson.message)
                        }
                    }, (error) => {
                        onFailure(error)
                    })

                    // var formData = new FormData()
                    // formData.append("assign_id", assignId)
                    // formData.append("assign_name", assignName)
                    // formData.append("ques_response", quesResp)
                    // formData.append("line_no", line)
                    // formData.append("shift_no", shift)
                    // formData.append("user_id", userData.id)
                    // formData.append("outlet_id", userData.businessId)
                    // formData.append("session_token", userData.sessionToken)
                    // formData.append("api_key", API_KEY)

                    // this.sendMediaPostFormRequest(Urls.SUBMIT_CHECK_URL, formData, (responseJson) => {
                    //     if (responseJson.status) {
                    //         onSuccess(responseJson)
                    //     } else {
                    //         onFailure(responseJson.message)
                    //     }
                    // }, (error) => {
                    //     onFailure(error)
                    // })

                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    getSelectedLinesAndShift(onSuccess, onFailure) {
        prefManager.getLineAndShiftStatus((isLineDataExist, isShiftDataExist) => {
            if (isLineDataExist && isShiftDataExist) {
                var line = ""
                var shift = ""
                prefManager.getLineCheckData((isLineNA, isLine1, isLine2, isLine3) => {
                    if (isLineNA) {
                        line = "N/A"
                    } else {
                        if (isLine1) {
                            line = line + "1,"
                        }
                        if (isLine2) {
                            line = line + "2,"
                        }
                        if (isLine3) {
                            line = line + "3,"
                        }
                    }
                    prefManager.getShiftCheckData((isShiftNA, val) => {
                        if (isShiftNA) {
                            shift = "N/A"
                        } else {
                            if (val == 0) {
                                shift = "Morning"
                            } else if (val == 1) {
                                shift = "Evening"
                            }
                        }
                        onSuccess(line, shift)
                    })
                })
            } else {
                onFailure("Please define your working lines & shift.")
            }
        })
    }

    sendSimplePostFormRequest(url, _body, onResponse, onError) {
        var dt = Date.now().toString()
        var data = dt + url
        var key = CryptoJS.HmacSHA1(data, API_KEY)

        fetch(url, {
            method: 'POST',
            // signal: signal,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded',
                'dateTime': dt,
                'url': url,
                'key': key
            }),
            body: _body
        })
            .then((response) => response.json())
            .then((responseJson) => {
                onResponse(responseJson)
            }).catch((error) => {
                // controller.abort();
                onError('Something went wrong while connecting to server.')
            });
    }

    sendMediaPostFormRequest(url, formData, onResponse, onError) {
        var dt = Date.now().toString()
        var data = dt + url
        var key = CryptoJS.HmacSHA1(data, API_KEY)

        fetch(url, {
            method: 'POST',
            // signal: signal,
            headers: new Headers({
                'Content-Type': 'multipart/form-data',
                'dateTime': dt,
                'url': url,
                'key': key
            }),
            body: formData
        })
            .then((response) => response.json())
            .then((responseJson) => {
                onResponse(responseJson)
            }).catch((error) => {
                // controller.abort();
                onError('Something went wrong while connecting to server.')
            });
    }
}