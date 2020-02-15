import AsyncStorage from '@react-native-community/async-storage';

const LAST_FETCHED_DATA = "@ChecksData:LastFetched"
const LOCAL_PENDING_FORMS_DATA = "@ChecksData:LocalPendingForms"

export default class LocalDBManager {

    async removeAllData() {
        try {
            await AsyncStorage.multiRemove([
                LAST_FETCHED_DATA, LOCAL_PENDING_FORMS_DATA
            ])
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async updateLastFetchedData(jsonData, checkType) {
        try {
            if (checkType == "Open") {
                let jsonStr = JSON.stringify(jsonData)
                await AsyncStorage.setItem(LAST_FETCHED_DATA, jsonStr);
            }
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async getLastFetchedData(onResult) {
        try {
            const JDS = await AsyncStorage.getItem(LAST_FETCHED_DATA);
            let jsonData = JSON.parse(JDS)
            onResult(jsonData)
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async removeLastFetchedData() {
        try {
            await AsyncStorage.removeItem(LAST_FETCHED_DATA)
        } catch (ex) {
            console.warn(ex.message)
        }
    }

    async updatePendingFormsData(formData, onSuccess, onFailure) {
        try {
            let jForms = []
            let forms = await AsyncStorage.getItem(LOCAL_PENDING_FORMS_DATA)
            if (forms && forms != null) {
                jForms = JSON.parse(forms)
                jForms.push(formData)
            } else {
                jForms.push(formData)
            }
            let jsonStr = JSON.stringify(jForms)
            await AsyncStorage.setItem(LOCAL_PENDING_FORMS_DATA, jsonStr);
            onSuccess()
        } catch (ex) {
            console.warn(ex.message)
            onFailure("something went wrong try again")
        }
    }

    async getLocalPendingFormsData(onResult) {
        try {
            const JDS = await AsyncStorage.getItem(LOCAL_PENDING_FORMS_DATA);
            let jsonData = JSON.parse(JDS)
            onResult(jsonData)
        } catch (ex) {
            onResult(null)
            console.warn(ex.message)
        }
    }

    async removeFromPendingFormsData(checkId, onResult) {
        try {
            let jForms = []
            let forms = await AsyncStorage.getItem(LOCAL_PENDING_FORMS_DATA)
            if (forms && forms != null) {
                jForms = JSON.parse(forms)
                let indx = jForms.findIndex(form => form.checkId == checkId)
                if (indx > -1) {
                    jForms.splice(indx, 1)
                }
            }
            let jsonStr = JSON.stringify(jForms)
            await AsyncStorage.setItem(LOCAL_PENDING_FORMS_DATA, jsonStr);
            onResult()
        } catch (ex) {
            console.warn(ex.message)
        }
    }


}