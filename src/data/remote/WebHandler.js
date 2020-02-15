import PrefManager from '../local/PrefManager'
import Urls from "./Urls"
import LocalDBManager from "../local/LocalDBManager"

import CryptoJS from "crypto-js"
import MyUtils from '../../utils/MyUtils';

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
                    prefManager.setDummyLinesAndShiftsData(responseJson.data.shifts, responseJson.data.plants)
                    prefManager.setFirebaseDBRoot(responseJson.document_name)
                    onSuccess(responseJson)
                } else {
                    onFailure(responseJson.message)
                }
            }, (error) => {
                onFailure(error)
            });
    }

    getUserChecks(pageNo, checkTypes, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (plant === "" || line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        prefManager.getLineProductData((isLineProductNA, selectedLPIndx, selecetedLPId) => {

                            if (userData.userPrimaryType != prefManager.EDITOR && userData.userPrimaryType != prefManager.ADMIN &&
                                line != "N/A" && MyUtils.isEmptyString(selecetedLPId)) {
                                onFailure("Please define line product")
                                return
                            }
                            var body =
                                "user_id=" + userData.id +
                                "&outlet_id=" + userData.businessId +
                                "&role=" + userData.userPrimaryType +
                                "&group_id=" + userData.userPrimaryGId +
                                "&session_token=" + userData.sessionToken +
                                // "&line_timing=" + line.substring(0, line.lastIndexOf(",")) +
                                "&line_timing=" + line +
                                "&shift_timing=" + shift +
                                "&plant_name=" + plant +
                                "&calling_status=" + checkTypes +
                                "&product_id=" + selecetedLPId +
                                "&limit=" + 10 +
                                "&page_number=" + pageNo

                            this.sendSimplePostFormRequest(Urls.CHECKS_LIST_URL, body, (responseJson) => {
                                if (pageNo == 1) {
                                    localDB.updateLastFetchedData(responseJson, checkTypes)
                                }
                                if (responseJson.status) {
                                    onSuccess(responseJson)
                                } else {
                                    onFailure(responseJson.message)
                                }
                            }, (error) => {
                                onFailure(error)
                            })

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
                    if (plant === "" || line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "assign_id=" + assignId +
                            "&assign_name=" + assignName +
                            "&ques_response=" + quesResp +
                            "&plant_name=" + plant +
                            "&line_no=" + line +
                            "&shift_no=" + shift +
                            "&user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&program_types=" + pTypes +
                            "&session_token=" + userData.sessionToken

                        console.log(body)

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
                    }
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
                    prefManager.getLineCheckData((isLineNA, selectedIndx, selecetedVal) => {
                        if (isLineNA) {
                            line = "N/A"
                        } else {
                            // linesData.map((item, index) => {
                            //     if (item.isChecked) {
                            //         line = line + item.val + ","
                            //     }
                            // })
                            line = selecetedVal
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

    updateMessageStatus(callingType, chatType, messageId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&calling_type=" + callingType +
                    "&chat_type=" + chatType +
                    "&type_id=" + messageId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.UPDATE_CHAT_MESSAGE_STATUS_URL, body, (responseJson) => {
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

    getFixedChecksList(onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&group_id=" + userData.userPrimaryGId

                this.sendSimplePostFormRequest(Urls.FIXED_CHECKS_LIST_URL, body, (responseJson) => {
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

    getFixedCheckData(checkId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&check_id=" + checkId
                this.sendSimplePostFormRequest(Urls.FIXED_CHECK_DATA_URL, body, (responseJson) => {
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

    submitFixedFormData(formId, assignId, response, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (plant === "" || line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +
                            // "&line_no=" + line.substring(0, line.lastIndexOf(",")) +
                            "&line_no=" + line +
                            "&shift_no=" + shift +
                            "&plant_name=" + plant +
                            "&response=" + response +
                            "&check_id=" + formId +
                            "&assign_id=" + assignId
                        this.sendSimplePostFormRequest(Urls.SUBMIT_FIXED_FORM_DATA_URL, body, (responseJson) => {
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

    getLineProducts(lineId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body = "line=" + lineId +
                    "&user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken
                this.sendSimplePostFormRequest(Urls.GET_LINE_PRODUCTS_URL, body, (responseJson) => {
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

    submitFixedFormAsDraftData(formId, assignId, response, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (plant === "" || line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +
                            // "&line_no=" + line.substring(0, line.lastIndexOf(",")) +
                            "&line_no=" + line +
                            "&shift_no=" + shift +
                            "&plant_name=" + plant +
                            "&response=" + response +
                            "&check_id=" + formId +
                            "&assign_id=" + assignId

                        this.sendSimplePostFormRequest(Urls.SUBMIT_FIXED_FORM_AS_DRAFT_URL, body, (responseJson) => {
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

    getFixedFormsDrafts(pageNo, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                this.getSelectedLinesAndShift((plant, line, shift) => {
                    if (plant === "" || line === "" || shift === "") {
                        onFailure("Please define your Lines & Shift")
                    } else {
                        var body =
                            "user_id=" + userData.id +
                            "&outlet_id=" + userData.businessId +
                            "&session_token=" + userData.sessionToken +
                            "&group_id=" + userData.userPrimaryGId +
                            // "&line_no=" + line.substring(0, line.lastIndexOf(",")) +
                            "&line_no=" + line +
                            "&shift_no=" + shift +
                            "&plant_name=" + plant +
                            "&page_no=" + pageNo

                        this.sendSimplePostFormRequest(Urls.GET_FIXED_FORM_DRAFT_URL, body, (responseJson) => {
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

    getFixedFormDraftDetail(checkId, assignId, onSuccess, onFailure) {
        prefManager.getUserSessionData(userData => {
            if (userData != null) {
                var body =
                    "user_id=" + userData.id +
                    "&outlet_id=" + userData.businessId +
                    "&session_token=" + userData.sessionToken +
                    "&group_id=" + userData.userPrimaryGId +
                    "&check_id=" + checkId +
                    "&assign_id=" + assignId

                this.sendSimplePostFormRequest(Urls.GET_FIXED_FORM_DRAFT_DETAIL_URL, body, (responseJson) => {
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

        console.log("URL==> " + url)
        console.log("PARAMS==> " + _body)
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
            .then((response) => {
                return response.json()
            })
            .then((responseJson) => {
                console.log("RESPONSE==> " + JSON.stringify(responseJson))
                onResponse(responseJson)
            }).catch((error) => {
                console.log(error.message)
                // onError(error.message)
                onError('Something went wrong while connecting to server.')

                // fetch(url, {
                //     method: 'POST',
                //     // signal: signal,
                //     headers: new Headers({
                //         'Content-Type': 'application/x-www-form-urlencoded',
                //         'dateTime': dt,
                //         'url': url,
                //         'key': key
                //     }),
                //     body: _body
                // })
                //     .then((response) => response.text())
                //     .then((responseText) => {
                //         console.log("RESPONSE==> " + responseText)
                //         alert(JSON.stringify(responseText))
                //         onError(error.message)
                //     }).catch((error2) => {
                //         console.log("RESPONSE==> " + error2.message)
                //         alert(error2.message)
                //         onError(error2.message)
                //     });
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
                console.log(error.message)
                onError('Something went wrong while connecting to server.')
            });
    }

}