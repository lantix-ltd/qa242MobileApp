import AsyncStorage from '@react-native-community/async-storage';
import WebHandler from '../remote/WebHandler';

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

    async updateLastFetchedData(jsonData, checkType, onCompleted) {
        try {
            if (checkType == "Open") {
                let jsonStr = JSON.stringify(jsonData)
                await AsyncStorage.setItem(LAST_FETCHED_DATA, jsonStr);
                onCompleted()
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

    fetchChecksDetail(onCompleted) {
        this.getLastFetchedData(checksData => {
            if (checksData) {
                const webHandler = new WebHandler()
                let webRequestsPromises = []
                checksData.data.map((check, index) => {
                    if (!check.detail) {
                        let p = new Promise((resolve, reject) => {
                            webHandler.getCheckListDetail(check.assign_id,
                                (responseJson) => {
                                    check.detail = responseJson.data[0]
                                    this.updateLastFetchedData(checksData, "Open", () => {
                                        resolve(check.assign_id + " ==> Fetched")
                                    })
                                },
                                (error) => { reject(new Error(error)) })
                        })
                        webRequestsPromises.push(p)
                    }
                })
                Promise.all(webRequestsPromises).then((result) => {
                    onCompleted()
                }).catch((ex) => {
                    console.log(ex)
                    onCompleted()
                })
            }
        })
    }

    getCheckDetail(checkId, onLoaded) {
        this.getLastFetchedData(checksData => {
            if (checksData && checksData.data) {
                let data = checksData.data.find(i => i.assign_id == checkId)
                if (data) {
                    onLoaded(data.detail)
                } else {
                    onLoaded(null)
                }
            } else { onLoaded(null) }
        })
    }

    updateCheckDetail(checkId, checkDetail) {
        this.getLastFetchedData(checksData => {
            if (checksData && checksData.data) {
                let cIndx = checksData.data.find(i => i.assign_id == checkId)
                if (cIndx > -1) {
                    checksData.data[cIndx].detail = checkDetail
                } else {
                    checksData.data.push({ assign_id: checkId, detail: checkDetail })
                }
                this.updateLastFetchedData(checksData, "Open", () => { })
            }
        })
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