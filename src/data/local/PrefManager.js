import AsyncStorage from '@react-native-community/async-storage';

const USER_ID_KEY = "@Session:UserId"
const USER_NAME_KEY = "@Session:UserName"
const USER_FNAME_KEY = "@Session:UserFName"
const USER_LNAME_KEY = "@Session:UserLName"
const USER_MOBNO_KEY = "@Session:UserMobNo"
const USER_PIC_KEY = "@Session:UserPicPath"
const USER_PRIMARY_GID_KEY = "@Session:UserPrimaryGroupId"
const USER_PRIMARY_TYPE_KEY = "@Session:UserPrimaryType"
const USER_SECONDARY_GID_KEY = "@Session:UserSecondaryGroupId"
const USER_SECONDARY_TYPE_KEY = "@Session:UserSecondaryType"

const BUSINESS_ID_KEY = "@Session:BusinessId"
const IS_LOGIN_KEY = "@Session:IsUserLogin"
const USER_SESSION_TOKEN_KEY = "@Session:UserToken"

const IS_LINE_CHECK_EXIST = "@General:IsLineCheckExist"
const IS_SHIFT_CHECK_EXIST = "@General:IsShiftCheckExist"
const IS_LINE_CHECK_NA = "@General:IsLineCheckNA"
const IS_LINE_1 = "@General:IsLine1"
const IS_LINE_2 = "@General:IsLine2"
const IS_LINE_3 = "@General:IsLine3"
const IS_SHIFT_CHECK_NA = "@General:IsShiftCheckNA"
const SELECTED_SHIFT_VAL = "@General:SelectedShiftVal"

const LAST_OPENED_CHECK_FORM = "@Checks:LastOpenedForm"

export default class PrefManager {

    AGENT = "agent"; EDITOR = "editor"; ADMIN = "admin"; OWNER = "owner";

    async createNewUserSession(userData, token) {
        try {
            await AsyncStorage.setItem(USER_ID_KEY, userData.userId.toString());
            await AsyncStorage.setItem(USER_NAME_KEY, userData.userName.toString());
            await AsyncStorage.setItem(USER_PIC_KEY, userData.picPath.toString());

            await AsyncStorage.setItem(USER_FNAME_KEY, userData.userFName.toString());
            await AsyncStorage.setItem(USER_LNAME_KEY, userData.userLName.toString());
            await AsyncStorage.setItem(USER_MOBNO_KEY, userData.userMobNo.toString());

            await AsyncStorage.setItem(USER_PRIMARY_TYPE_KEY, userData.primary_type.toString());
            await AsyncStorage.setItem(USER_PRIMARY_GID_KEY, userData.primary_gid.toString());

            await AsyncStorage.setItem(USER_SECONDARY_TYPE_KEY, userData.secondary_type.toString());
            await AsyncStorage.setItem(USER_SECONDARY_GID_KEY, userData.secondary_gid.toString());

            await AsyncStorage.setItem(BUSINESS_ID_KEY, userData.businessId.toString());
            await AsyncStorage.setItem(USER_SESSION_TOKEN_KEY, token.toString());
            await AsyncStorage.setItem(IS_LOGIN_KEY, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getUserSessionData(onResult) {
        try {
            const id = await AsyncStorage.getItem(USER_ID_KEY);
            const un = await AsyncStorage.getItem(USER_NAME_KEY);

            const p_gid = await AsyncStorage.getItem(USER_PRIMARY_GID_KEY);
            const p_type = await AsyncStorage.getItem(USER_PRIMARY_TYPE_KEY);

            const s_gid = await AsyncStorage.getItem(USER_SECONDARY_GID_KEY);
            const s_type = await AsyncStorage.getItem(USER_SECONDARY_TYPE_KEY);

            const businessId = await AsyncStorage.getItem(BUSINESS_ID_KEY);
            const token = await AsyncStorage.getItem(USER_SESSION_TOKEN_KEY);
            let data = {
                id: id,
                username: un,
                userPrimaryGId: p_gid,
                userPrimaryType: p_type,
                userSecondaryGId: s_gid,
                userSecondaryType: s_type,
                businessId: businessId,
                sessionToken: token
            }
            onResult(data)
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async getUserProfileData(onResult) {
        try {
            const id = await AsyncStorage.getItem(USER_ID_KEY);
            const un = await AsyncStorage.getItem(USER_NAME_KEY);
            const pic = await AsyncStorage.getItem(USER_PIC_KEY);
            const fn = await AsyncStorage.getItem(USER_FNAME_KEY);
            const ln = await AsyncStorage.getItem(USER_LNAME_KEY);
            const mn = await AsyncStorage.getItem(USER_MOBNO_KEY);
            let data = {
                id: id,
                username: un,
                userpic: pic,
                fname: fn,
                lname: ln,
                mobileNo: mn
            }
            onResult(data)
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async isUserLoggedIn(onResult) {
        try {
            const val = await AsyncStorage.getItem(IS_LOGIN_KEY);
            if (val != undefined && val == 'true') {
                onResult(true)
            } else {
                onResult(false)
            }
        } catch (ex) {
            onResult(false)
            console.warn(ex.message)
        }
    }

    async destroyUserSession() {
        try {
            await AsyncStorage.multiRemove([
                USER_ID_KEY, USER_NAME_KEY,
                USER_FNAME_KEY, USER_LNAME_KEY,
                USER_PIC_KEY, USER_MOBNO_KEY,
                USER_PRIMARY_TYPE_KEY, USER_SECONDARY_TYPE_KEY,
                USER_PRIMARY_GID_KEY, USER_SECONDARY_GID_KEY,
                BUSINESS_ID_KEY, USER_SESSION_TOKEN_KEY,
                IS_LOGIN_KEY, IS_LINE_CHECK_EXIST, IS_SHIFT_CHECK_EXIST,
                IS_LINE_CHECK_NA, IS_LINE_1, IS_LINE_2, IS_LINE_3,
                IS_SHIFT_CHECK_NA, SELECTED_SHIFT_VAL, LAST_OPENED_CHECK_FORM
            ])
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async cleanLinesAndShiftData() {
        try {
            await AsyncStorage.multiRemove([
                IS_LINE_CHECK_NA, IS_LINE_1, IS_LINE_2, IS_LINE_3,
                IS_SHIFT_CHECK_NA, SELECTED_SHIFT_VAL,
                IS_LINE_CHECK_EXIST, IS_SHIFT_CHECK_EXIST
            ])
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineAndShiftStatus(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_LINE_CHECK_EXIST);
            const v2 = await AsyncStorage.getItem(IS_SHIFT_CHECK_EXIST);
            onResult((v1 != undefined && v1 == 'true'), (v2 != undefined && v2 == 'true'))
        } catch (ex) {
            onResult(false, false)
            console.warn(ex.message)
        }
    }

    async setLineCheckData(isLineNA, isLine1, isLine2, isLine3) {
        try {
            await AsyncStorage.setItem(IS_LINE_CHECK_NA, String(isLineNA));
            await AsyncStorage.setItem(IS_LINE_1, String(isLine1));
            await AsyncStorage.setItem(IS_LINE_2, String(isLine2));
            await AsyncStorage.setItem(IS_LINE_3, String(isLine3));
            await AsyncStorage.setItem(IS_LINE_CHECK_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineCheckData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_LINE_CHECK_NA);
            const v2 = await AsyncStorage.getItem(IS_LINE_1);
            const v3 = await AsyncStorage.getItem(IS_LINE_2);
            const v4 = await AsyncStorage.getItem(IS_LINE_3);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (v2 != undefined && v2 == 'true'),
                (v3 != undefined && v3 == 'true'),
                (v4 != undefined && v4 == 'true')
            )
        } catch (ex) {
            onResult(false, false, false, false)
            console.warn(ex.message)
        }
    }

    async setShiftCheckData(isShiftNA, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_SHIFT_CHECK_NA, String(isShiftNA));
            await AsyncStorage.setItem(SELECTED_SHIFT_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_SHIFT_CHECK_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getShiftCheckData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_SHIFT_CHECK_NA);
            const v2 = await AsyncStorage.getItem(SELECTED_SHIFT_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (v2 != undefined ? parseInt(v2) : -1),
            )
        } catch (ex) {
            onResult(false, -1)
            console.warn(ex.message)
        }
    }

    async updateLastOpenedForm(data) {
        try {
            await AsyncStorage.setItem(LAST_OPENED_CHECK_FORM, JSON.stringify(data));
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLastOpenedForm(onResult) {
        try {
            const data = await AsyncStorage.getItem(LAST_OPENED_CHECK_FORM);
            if (data != undefined) {
                onResult(JSON.parse(data))
            } else {
                onResult(null)
            }
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }
}