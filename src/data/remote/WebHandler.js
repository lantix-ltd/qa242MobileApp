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
                        userName: userName,
                        userPassword: password,
                        email: data.email,
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

    getUserChecks(pageNo, checkTypes, onSuccess, onFailure, onOffLineData) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&role=" + userData.userPrimaryType +
                            "&group_id=" + userData.userPrimaryGId +
                            "&session_token=" + userData.sessionToken +
                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +
                            "&calling_status=" + checkTypes +
                            "&page_number=" + pageNo
                        this.sendSimplePostFormRequest(Urls.CHECKS_LIST_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                localDB.addNewChecks(responseJson.data)
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            // localDB.getAllChecks(
                            //     checksData => {
                            //         onOffLineData(checksData)
                            //     },
                            //     dbError => {
                            //         onFailure(error)
                            //     }
                            // )
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
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

    getCheckListDetailForCompleted(assignId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "assign_id=" + assignId +
                    "&user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&role=editor" +
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

    submitCheck(assignId, assignName, quesResp, pTypes, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    var body =
                        "assign_id=" + assignId +
                        "&assign_name=" + assignName +
                        "&ques_response=" + quesResp +
                        "&line_no=" + line +
                        "&shift_no=" + shift +
                        "&user_id=" + userData.id +
                        "&outlet_id=" + userData.businessId +
                        "&program_types=" + pTypes +
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
                var plant = ""
                var line = ""
                var shift = ""
                prefManager.getPlantCheckData((isPlantNA, selectedIndx, selecetedVal) => {
                    if (isPlantNA) {
                        plant = "N/A"
                    } else {
                        plant = selecetedVal
                    }
                    prefManager.getLineCheckData((isLineNA, linesData) => {
                        if (isLineNA) {
                            line = "N/A"
                        } else {
                            linesData.map((item, index) => {
                                if (item.isChecked) {
                                    line = line + item.val + ","
                                }
                            })
                        }
                        prefManager.getShiftCheckData((isShiftNA, selectedIndx, selecetedVal) => {
                            if (isShiftNA) {
                                shift = "N/A"
                            } else {
                                shift = selecetedVal
                            }
                            onSuccess(plant, line, shift)
                        })
                    })
                })
            } else {
                onFailure("Please define your working lines & shift.")
            }
        })
    }

    getUserNotifications(pageNo, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&page_number=" + pageNo
                this.sendSimplePostFormRequest(Urls.USER_NOTIFICATIONS_URL, body, (responseJson) => {
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

    submitAsReviewd(assignId, comment, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&assign_id=" + assignId +
                    "&review_comments=" + comment
                this.sendSimplePostFormRequest(Urls.SUBMIT_AS_REVIEWED_URL, body, (responseJson) => {
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

    getAllUsersContacts(pageNo, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&page_number=" + pageNo
                this.sendSimplePostFormRequest(Urls.ALL_USERS_CONTACTS_URL, body, (responseJson) => {
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

    updatePassword(oldPass, newPass, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&old_password=" + oldPass +
                    "&new_password=" + newPass
                this.sendSimplePostFormRequest(Urls.UPDATE_PASSWORD_URL, body, (responseJson) => {
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

    updateUserInfo(fName, lName, mobileNo, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&first_name=" + fName +
                    "&last_name=" + lName +
                    "&phone=" + mobileNo
                this.sendSimplePostFormRequest(Urls.UPDATE_PROFILE_INFO_URL, body, (responseJson) => {
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

    updateUserProfilePic(picPath, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var formData = new FormData()
                formData.append("user_id", userData.id)
                formData.append("outlet_id", userData.businessId)
                formData.append("session_token", userData.sessionToken)
                formData.append("user_image", { uri: picPath, name: 'ProfilePic.jpg', type: 'multipart/form-data' })

                this.sendMediaPostFormRequest(Urls.UPDATE_PROFILE_PIC_URL, formData, (responseJson) => {
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

    logOutUser(onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.LOGOUT_USER_URL, body, (responseJson) => {
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

    getUserChatHistory(onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.CHAT_HISTORY_URL, body, (responseJson) => {
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

    sendMessageToServer(chatType, message, toUserId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&chattype=" + chatType +
                    "&message=" + message +
                    "&to=" + toUserId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.SEND_MESSAGE_URL, body, (responseJson) => {
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

    submitAsApproved(assignId, comment, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&assign_id=" + assignId +
                    "&review_comments=" + comment
                this.sendSimplePostFormRequest(Urls.SUBMIT_AS_ACCEPTED_URL, body, (responseJson) => {
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

    submitTrcuckInspectionForm(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            "&monitorName=" + inspectionData.monitorName +
                            "&time=" + inspectionData.time +
                            "&InvoiceNo=" + inspectionData.InvoiceNo +
                            "&itemName=" + inspectionData.itemName +
                            "&supplierName=" + inspectionData.supplierName +
                            "&SPApprovedIndex=" + inspectionData.SPApprovedIndex +
                            "&carrierName=" + inspectionData.carrierName +
                            "&truckLPlate=" + inspectionData.truckLPlate +
                            "&trailerLPlate=" + inspectionData.trailerLPlate +
                            "&driverLInfo=" + inspectionData.driverLInfo +
                            "&trailerSealedIndx=" + inspectionData.trailerSealedIndx +
                            "&trailerLockedIndx=" + inspectionData.trailerLockedIndx +
                            "&materialsFreeIndex=" + inspectionData.materialsFreeIndex +
                            "&truckInsideIndx=" + inspectionData.truckInsideIndx +
                            "&productCondtionIndx=" + inspectionData.productCondtionIndx +
                            "&productTempIndx=" + inspectionData.productTempIndx +
                            "&vvOfProductIndx=" + inspectionData.vvOfProductIndx +
                            "&allergenContentIndx=" + inspectionData.allergenContentIndx +
                            "&allergentaqggedIndx=" + inspectionData.allergentaqggedIndx +
                            "&markedWithExpDateIndx=" + inspectionData.markedWithExpDateIndx +
                            "&inspectionSummaryIndx=" + inspectionData.inspectionSummaryIndx +
                            "&followUpAction=" + inspectionData.followUpAction +
                            "&correctiveActionDetail=" + inspectionData.correctiveActionDetail

                        this.sendSimplePostFormRequest(Urls.TRUCK_INSPECT_FORM_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitShippingInspectionForm(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            //"&monitorName=" + inspectionData.monitorName +
                            "&checkIntime=" + inspectionData.checkIntime +
                            "&soNo=" + inspectionData.soNo +
                            "&itemName=" + inspectionData.itemName +
                            "&customerName=" + inspectionData.customerName +
                            "&carrierName=" + inspectionData.carrierName +
                            "&truckTrailerLPlate=" + inspectionData.truckTrailerLPlate +
                            "&driverLInfo=" + inspectionData.driverLInfo +
                            "&truckSetTemp=" + inspectionData.truckSetTemp +
                            "&truckReadingTemp=" + inspectionData.truckReadingTemp +
                            "&truckCondiAcceptable=" + inspectionData.truckCondiAcceptable +
                            "&frozenProductTemp=" + inspectionData.frozenProductTemp +
                            "&refrigeratedProductTemp=" + inspectionData.refrigeratedProductTemp +
                            "&firstProductSurfaceTemp=" + inspectionData.firstProductSurfaceTemp +
                            "&lastProductSurfaceTemp=" + inspectionData.lastProductSurfaceTemp +
                            "&productCondiAcceptable=" + inspectionData.productCondiAcceptable +
                            "&signOfTemparing=" + inspectionData.signOfTemparing +
                            "&isSecured=" + inspectionData.isSecured +
                            "&sealNo=" + inspectionData.sealNo +
                            "&lotNoCheck=" + inspectionData.lotNoCheck +
                            "&lotNo=" + inspectionData.lotNo +
                            "&isBOL=" + inspectionData.isBOL +
                            "&inspectionSummary=" + inspectionData.inspectionSummary +
                            "&checkOutTime=" + inspectionData.checkOutTime +
                            "&followUpAction=" + inspectionData.followUpAction +
                            "&correctiveAction=" + inspectionData.correctiveAction

                        this.sendSimplePostFormRequest(Urls.SHIPPING_INSPECT_FORM_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitpalletizingInspectionForm(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            "&palletNo=" + inspectionData.palletNo +
                            "&time=" + inspectionData.time +
                            "&itemNumber=" + inspectionData.itemNumber +
                            "&cases=" + inspectionData.cases +
                            "&usedByDate=" + inspectionData.usedByDate +
                            "&codeDate=" + inspectionData.codeDate
                        // "&initials=" + inspectionData.initials

                        this.sendSimplePostFormRequest(Urls.PALLETIZING_FORM_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitCleaningInspectionForm(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +


                            "&circleSelectedVal=" + inspectionData.circleSelectedVal +
                            "&plProduced=" + inspectionData.plProduced +
                            "&allergenProfile1=" + inspectionData.allergenProfile1 +
                            "&ptbStarted=" + inspectionData.ptbStarted +
                            "&allergenProfile2=" + inspectionData.allergenProfile2 +

                            "&q1SelectedVal=" + inspectionData.q1SelectedVal +
                            "&q1CorrectiveAction=" + inspectionData.q1CorrectiveAction +
                            "&q2SelectedVal=" + inspectionData.q2SelectedVal +
                            "&q2CorrectiveAction=" + inspectionData.q2CorrectiveAction +
                            "&q3SelectedVal=" + inspectionData.q3SelectedVal +
                            "&q3CorrectiveAction=" + inspectionData.q3CorrectiveAction +
                            "&q4SelectedVal=" + inspectionData.q4SelectedVal +
                            "&q4CorrectiveAction=" + inspectionData.q4CorrectiveAction +
                            "&q5SelectedVal=" + inspectionData.q5SelectedVal +
                            "&q5CorrectiveAction=" + inspectionData.q5CorrectiveAction +
                            "&q6SelectedVal=" + inspectionData.q6SelectedVal +
                            "&q6CorrectiveAction=" + inspectionData.q6CorrectiveAction +
                            "&q7SelectedVal=" + inspectionData.q7SelectedVal +
                            "&q7CorrectiveAction=" + inspectionData.q7CorrectiveAction +
                            "&q8SelectedVal=" + inspectionData.q8SelectedVal +
                            "&q8CorrectiveAction=" + inspectionData.q8CorrectiveAction +
                            "&q9SelectedVal=" + inspectionData.q9SelectedVal +
                            "&q9CorrectiveAction=" + inspectionData.q9CorrectiveAction +
                            "&q10SelectedVal=" + inspectionData.q10SelectedVal +
                            "&q10CorrectiveAction=" + inspectionData.q10CorrectiveAction +
                            "&q11SelectedVal=" + inspectionData.q11SelectedVal +
                            "&q11CorrectiveAction=" + inspectionData.q11CorrectiveAction +
                            "&q12SelectedVal=" + inspectionData.q12SelectedVal +
                            "&q12CorrectiveAction=" + inspectionData.q12CorrectiveAction +
                            "&q13SelectedVal=" + inspectionData.q13SelectedVal +
                            "&q13CorrectiveAction=" + inspectionData.q13CorrectiveAction +
                            "&q14SelectedVal=" + inspectionData.q14SelectedVal +
                            "&q14CorrectiveAction=" + inspectionData.q14CorrectiveAction +
                            "&q15SelectedVal=" + inspectionData.q15SelectedVal +
                            "&q15CorrectiveAction=" + inspectionData.q15CorrectiveAction +
                            "&q16SelectedVal=" + inspectionData.q16SelectedVal +
                            "&q16CorrectiveAction=" + inspectionData.q16CorrectiveAction +
                            "&q17SelectedVal=" + inspectionData.q17SelectedVal +
                            "&q17CorrectiveAction=" + inspectionData.q17CorrectiveAction +
                            "&q18SelectedVal=" + inspectionData.q18SelectedVal +
                            "&q18CorrectiveAction=" + inspectionData.q18CorrectiveAction +
                            "&q19SelectedVal=" + inspectionData.q19SelectedVal +
                            "&q19CorrectiveAction=" + inspectionData.q19CorrectiveAction +
                            "&q20SelectedVal=" + inspectionData.q20SelectedVal +
                            "&q20CorrectiveAction=" + inspectionData.q20CorrectiveAction

                        this.sendSimplePostFormRequest(Urls.CLEANING_INSPECT_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitBulkInspectionForm1(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            "&packingOperator=" + inspectionData.packingOperator +
                            "&productName=" + inspectionData.productName +
                            "&itemNumber=" + inspectionData.itemNumber +
                            "&palletNo=" + inspectionData.palletNo +
                            "&timeInCooler=" + inspectionData.timeInCooler +
                            "&timeOutCooler=" + inspectionData.timeOutCooler +
                            "&temp=" + inspectionData.temp +
                            "&correctiveAction=" + inspectionData.correctiveAction

                        this.sendSimplePostFormRequest(Urls.BULK_INSPECT_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitBulkInspectionForm2(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            "&item=" + inspectionData.item +
                            "&date=" + inspectionData.date +
                            "&lotCode=" + inspectionData.lotCode +
                            "&expDate=" + inspectionData.expDate +
                            "&time=" + inspectionData.time +
                            "&allergen=" + inspectionData.allergen +
                            "&qty=" + inspectionData.qty +
                            "&palletNo=" + inspectionData.palletNo

                        this.sendSimplePostFormRequest(Urls.BULK_INSPECT_2_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    submitRepackInspectionForm(inspectionData, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +

                            "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                            "&shift_timing=" + shift +
                            "&plant_name=" + plant +

                            "&selected_source=" + inspectionData.selected_source +
                            "&source_item_no=" + inspectionData.source_item_no +
                            "&source_product_temp=" + inspectionData.source_product_temp +
                            "&source_brand_name=" + inspectionData.source_brand_name +
                            "&source_product_name=" + inspectionData.source_product_name +
                            "&source_allergens=" + inspectionData.source_allergens +
                            "&source_case_used=" + inspectionData.source_case_used +
                            "&source_production_date=" + inspectionData.source_production_date +
                            "&source_nav_lot_code=" + inspectionData.source_nav_lot_code +
                            "&pack_to_item_no=" + inspectionData.pack_to_item_no +
                            "&pack_to_brand_name=" + inspectionData.pack_to_brand_name +
                            "&pack_to_product_name=" + inspectionData.pack_to_product_name +
                            "&pack_to_allergens=" + inspectionData.pack_to_allergens +
                            "&pack_to_cases_made=" + inspectionData.pack_to_cases_made +
                            "&pack_to_exp_date=" + inspectionData.pack_to_exp_date +
                            "&comments=" + inspectionData.comments

                        this.sendSimplePostFormRequest(Urls.REPACK_INSPECT_URL, body, (responseJson) => {
                            if (responseJson.status) {
                                onSuccess(responseJson)
                            } else {
                                onFailure(responseJson.message)
                            }
                        }, (error) => {
                            onFailure(error)
                        })
                    }
                }, error => {
                    onFailure(error)
                })
            } else {
                onFailure("User session not exist!")
            }
        })
    }

    deleteCheckMedia(assignId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&assign_id=" + assignId

                this.sendSimplePostFormRequest(Urls.DELETE_MEDIA_URL, body, (responseJson) => {
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

    async uploadCheckMedia(assignId, mediaFile, mediaType, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var formData = new FormData()
                formData.append("user_id", userData.id)
                formData.append("outlet_id", userData.businessId)
                formData.append("session_token", userData.sessionToken)
                formData.append("assign_id", assignId)
                var ext = (mediaType === "video") ? ".mp4" : ".jpg"
                formData.append("answer_media", { uri: mediaFile, name: "MediaFile" + ext, type: 'multipart/form-data' })
                formData.append("media_type", mediaType)

                this.sendMediaPostFormRequest(Urls.UPLOAD_MEDIA_URL, formData, (responseJson) => {
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
                onError(error.message)
                // controller.abort();
                // onError('Something went wrong while connecting to server.')
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