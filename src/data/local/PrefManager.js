import AsyncStorage from '@react-native-community/async-storage';

const USER_ID_KEY = "@Session:UserId"
const USER_NAME_KEY = "@Session:UserName"
const USER_PASSWORD_KEY = "@Session:UserPassword"
const USER_EMAIL_KEY = "@Session:UserEmail"
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

const IS_SHIFT_CHECK_EXIST = "@General:IsShiftCheckExist"
const IS_SHIFT_CHECK_NA = "@General:IsShiftCheckNA"
const SELECTED_SHIFT_INDEX = "@General:SelectedShiftIndex"
const SELECTED_SHIFT_VAL = "@General:SelectedShiftVal"

const IS_PLANT_CHECK_EXIST = "@General:IsPlantCheckExist"
const IS_PLANT_CHECK_NA = "@General:IsPlantCheckNA"
const SELECTED_PLANT_INDEX = "@General:SelectedPlantIndex"
const SELECTED_PLANT_VAL = "@General:SelectedPlantVal"

const IS_LINE_CHECK_EXIST = "@General:IsLineCheckExist"
const IS_LINE_CHECK_NA = "@General:IsLineCheckNA"
const SELECTED_LINE_INDEX = "@General:SelectedLineIndex"
const SELECTED_LINE_VAL = "@General:SelectedLineVal"

const IS_LINE_STATUS_EXIST = "@General:IsLineStatusExist"
const IS_LINE_STATUS_NA = "@General:IsLineStatusNA"
const SELECTED_LINE_STATUS_INDEX = "@General:SelectedLineStatusIndex"
const SELECTED_LINE_STATUS_VAL = "@General:SelectedLineStatusVal"

const IS_LINE_PRODUCT_EXIST = "@General:IsLineProductExist"
const IS_LINE_PRODUCT_NA = "@General:IsLineProductNA"
const SELECTED_LINE_PRODUCT_INDEX = "@General:SelectedLineProductIndex"
const SELECTED_LINE_PRODUCT_VAL = "@General:SelectedLineProductVal"

const DUMMY_LINES_DATA = "@General:DummyLinesD"
const DUMMY_SHIFTS_DATA = "@General:DummyShiftsD"
const DUMMY_PLANTS_DATA = "@General:DummyPlantsD"
const DUMMY_LINE_PRODUCTS_DATA = "@General:DummyLineProductsD"

const Firebase_DB_ROOT = "@General:FirebaseDBRoot"
const RELOAD_REQ_ROOT = "@General:ReloadRequired"

export default class PrefManager {

    AGENT = "agent"; EDITOR = "editor"; ADMIN = "admin"; OWNER = "owner";

    async createNewUserSession(userData, token) {
        try {
            await AsyncStorage.setItem(USER_ID_KEY, userData.userId.toString());
            await AsyncStorage.setItem(USER_NAME_KEY, userData.userName.toString());
            // await AsyncStorage.setItem(USER_PASSWORD_KEY, userData.userPassword.toString());
            await AsyncStorage.setItem(USER_EMAIL_KEY, userData.email.toString());
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
            // const up = await AsyncStorage.getItem(USER_PASSWORD_KEY);
            const em = await AsyncStorage.getItem(USER_EMAIL_KEY);

            const p_gid = await AsyncStorage.getItem(USER_PRIMARY_GID_KEY);
            const p_type = await AsyncStorage.getItem(USER_PRIMARY_TYPE_KEY);

            const s_gid = await AsyncStorage.getItem(USER_SECONDARY_GID_KEY);
            const s_type = await AsyncStorage.getItem(USER_SECONDARY_TYPE_KEY);

            const businessId = await AsyncStorage.getItem(BUSINESS_ID_KEY);
            const token = await AsyncStorage.getItem(USER_SESSION_TOKEN_KEY);
            let data = {
                id: id,
                username: un,
                userPassword: "up",
                email: em,
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

    async getLoginCredential(onResult) {
        const un = await AsyncStorage.getItem(USER_NAME_KEY);
        const up = await AsyncStorage.getItem(USER_PASSWORD_KEY);
        onResult(un, up)
    }

    async getUserProfileData(onResult) {
        try {
            const id = await AsyncStorage.getItem(USER_ID_KEY);
            const un = await AsyncStorage.getItem(USER_NAME_KEY);
            const em = await AsyncStorage.getItem(USER_EMAIL_KEY);
            const pic = await AsyncStorage.getItem(USER_PIC_KEY);
            const fn = await AsyncStorage.getItem(USER_FNAME_KEY);
            const ln = await AsyncStorage.getItem(USER_LNAME_KEY);
            const mn = await AsyncStorage.getItem(USER_MOBNO_KEY);
            let data = {
                id: id,
                username: un,
                email: em,
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

    async updateUserProfileInfo(fName, lName, mobileNo) {
        try {
            await AsyncStorage.setItem(USER_FNAME_KEY, fName.toString());
            await AsyncStorage.setItem(USER_LNAME_KEY, lName.toString());
            await AsyncStorage.setItem(USER_MOBNO_KEY, mobileNo.toString());
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async updateUserProfilePic(profilePicUrl) {
        try {
            await AsyncStorage.setItem(USER_PIC_KEY, profilePicUrl.toString());
        } catch (ex) {
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
                USER_ID_KEY,
                USER_FNAME_KEY, USER_LNAME_KEY,
                USER_PIC_KEY, USER_MOBNO_KEY,
                USER_PRIMARY_TYPE_KEY, USER_SECONDARY_TYPE_KEY,
                USER_PRIMARY_GID_KEY, USER_SECONDARY_GID_KEY,
                BUSINESS_ID_KEY, USER_SESSION_TOKEN_KEY,

                DUMMY_LINES_DATA, DUMMY_SHIFTS_DATA, DUMMY_PLANTS_DATA, DUMMY_LINE_PRODUCTS_DATA,

                IS_SHIFT_CHECK_EXIST, IS_SHIFT_CHECK_NA, SELECTED_SHIFT_VAL, SELECTED_SHIFT_INDEX,
                IS_PLANT_CHECK_EXIST, IS_PLANT_CHECK_NA, SELECTED_PLANT_INDEX, SELECTED_PLANT_VAL,
                IS_LINE_CHECK_EXIST, IS_LINE_CHECK_NA, SELECTED_LINE_INDEX, SELECTED_LINE_VAL,
                IS_LINE_STATUS_EXIST, IS_LINE_STATUS_NA, SELECTED_LINE_STATUS_VAL, SELECTED_LINE_STATUS_INDEX,
                IS_LINE_PRODUCT_EXIST, IS_LINE_PRODUCT_NA, SELECTED_LINE_PRODUCT_INDEX, SELECTED_LINE_PRODUCT_VAL
            ])
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async cleanLinesAndShiftData() {
        try {
            await AsyncStorage.multiRemove([
                IS_LINE_CHECK_NA, LINES_DATA,
                IS_SHIFT_CHECK_NA, SELECTED_SHIFT_VAL, SELECTED_SHIFT_INDEX,
                IS_LINE_CHECK_EXIST, IS_SHIFT_CHECK_EXIST,
                IS_PLANT_CHECK_EXIST, IS_PLANT_CHECK_NA, SELECTED_PLANT_INDEX, SELECTED_PLANT_VAL
            ])
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineAndShiftStatus(onResult) {
        try {
            const v0 = await AsyncStorage.getItem(IS_PLANT_CHECK_EXIST);
            const v1 = await AsyncStorage.getItem(IS_LINE_CHECK_EXIST);
            const v2 = await AsyncStorage.getItem(IS_SHIFT_CHECK_EXIST);
            onResult(
                (v0 != undefined && v0 == 'true' && v1 != undefined && v1 == 'true'),
                (v2 != undefined && v2 == 'true')
            )
        } catch (ex) {
            onResult(false, false)
            console.warn(ex.message)
        }
    }

    async setLineCheckData(isLineNA, selectedIndx, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_LINE_CHECK_NA, String(isLineNA));
            await AsyncStorage.setItem(SELECTED_LINE_INDEX, String(selectedIndx));
            await AsyncStorage.setItem(SELECTED_LINE_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_LINE_CHECK_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineCheckData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_LINE_CHECK_NA);
            const v2 = await AsyncStorage.getItem(SELECTED_LINE_INDEX);
            const v3 = await AsyncStorage.getItem(SELECTED_LINE_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (v2 != undefined ? parseInt(v2) : -1),
                v3
            )
        } catch (ex) {
            onResult(false, null)
            console.warn(ex.message)
        }
    }

    async setShiftCheckData(isShiftNA, selectedIndx, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_SHIFT_CHECK_NA, String(isShiftNA));
            await AsyncStorage.setItem(SELECTED_SHIFT_INDEX, String(selectedIndx));
            await AsyncStorage.setItem(SELECTED_SHIFT_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_SHIFT_CHECK_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getShiftCheckData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_SHIFT_CHECK_NA);
            const v2 = await AsyncStorage.getItem(SELECTED_SHIFT_INDEX);
            const v3 = await AsyncStorage.getItem(SELECTED_SHIFT_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (v2 != undefined ? parseInt(v2) : -1),
                v3
            )
        } catch (ex) {
            onResult(false, -1)
            console.warn(ex.message)
        }
    }

    async setPlantCheckData(isPlantNA, selectedIndx, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_PLANT_CHECK_NA, String(isPlantNA));
            await AsyncStorage.setItem(SELECTED_PLANT_INDEX, String(selectedIndx));
            await AsyncStorage.setItem(SELECTED_PLANT_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_PLANT_CHECK_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getPlantCheckData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_PLANT_CHECK_NA);
            const V2 = await AsyncStorage.getItem(SELECTED_PLANT_INDEX);
            const V3 = await AsyncStorage.getItem(SELECTED_PLANT_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (V2 != undefined ? parseInt(V2) : -1),
                V3
            )
        } catch (ex) {
            onResult(false, null, null)
            console.warn(ex.message)
        }
    }

    async setLineStausData(isLineStatusNA, selectedIndx, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_LINE_STATUS_NA, String(isLineStatusNA));
            await AsyncStorage.setItem(SELECTED_LINE_STATUS_INDEX, String(selectedIndx));
            await AsyncStorage.setItem(SELECTED_LINE_STATUS_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_LINE_STATUS_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineStatusData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_LINE_STATUS_NA);
            const V2 = await AsyncStorage.getItem(SELECTED_LINE_STATUS_INDEX);
            const V3 = await AsyncStorage.getItem(SELECTED_LINE_STATUS_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (V2 != undefined ? parseInt(V2) : -1),
                V3
            )
        } catch (ex) {
            onResult(false, null, null)
            console.warn(ex.message)
        }
    }

    async setLineProductData(isLineProductNA, selectedIndx, selecetedVal) {
        try {
            await AsyncStorage.setItem(IS_LINE_PRODUCT_NA, String(isLineProductNA));
            await AsyncStorage.setItem(SELECTED_LINE_PRODUCT_INDEX, String(selectedIndx));
            await AsyncStorage.setItem(SELECTED_LINE_PRODUCT_VAL, String(selecetedVal));
            await AsyncStorage.setItem(IS_LINE_PRODUCT_EXIST, "true");
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLineProductData(onResult) {
        try {
            const v1 = await AsyncStorage.getItem(IS_LINE_PRODUCT_NA);
            const V2 = await AsyncStorage.getItem(SELECTED_LINE_PRODUCT_INDEX);
            const V3 = await AsyncStorage.getItem(SELECTED_LINE_PRODUCT_VAL);
            onResult(
                (v1 != undefined && v1 == 'true'),
                (V2 != undefined ? parseInt(V2) : -1),
                ((V3 != undefined && V3 != -1) ? V3 : "")
            )
        } catch (ex) {
            onResult(false, null, null)
            console.warn(ex.message)
        }
    }

    async setDummyLinesAndShiftsData(shifts, plants) {
        try {
            await AsyncStorage.setItem(DUMMY_SHIFTS_DATA, JSON.stringify(shifts));
            await AsyncStorage.setItem(DUMMY_PLANTS_DATA, JSON.stringify(plants));
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getDummyLinesAndShiftsData(onResult) {
        try {
            const SD = await AsyncStorage.getItem(DUMMY_SHIFTS_DATA);
            const PD = await AsyncStorage.getItem(DUMMY_PLANTS_DATA);
            onResult(JSON.parse(SD), JSON.parse(PD))
        } catch (ex) {
            onResult(null, null, null)
            console.warn(ex.message)
        }
    }

    async setDummyLineProductsData(data) {
        try {
            await AsyncStorage.setItem(DUMMY_LINE_PRODUCTS_DATA, JSON.stringify(data));
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getDummyLineProductsData(onResult) {
        try {
            const PD = await AsyncStorage.getItem(DUMMY_LINE_PRODUCTS_DATA);
            onResult(JSON.parse(PD))
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async setFirebaseDBRoot(rootName) {
        try {
            await AsyncStorage.setItem(Firebase_DB_ROOT, rootName);
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getFirebaseDBRoot(onResult) {
        try {
            const RT = await AsyncStorage.getItem(Firebase_DB_ROOT);
            onResult(RT)
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async setReloadReq(val) {
        try {
            await AsyncStorage.setItem(RELOAD_REQ_ROOT, String(val));
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getReloadReq(onResult) {
        try {
            const RQ = await AsyncStorage.getItem(RELOAD_REQ_ROOT);
            onResult((RQ != undefined && RQ == 'true'))
        } catch (ex) {
            onResult(false)
            console.warn(ex.message)
        }
    }

}