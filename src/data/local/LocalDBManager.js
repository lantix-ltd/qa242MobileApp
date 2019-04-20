import Realm from "realm"

const CheckSchema = {
    name: "Check",
    primaryKey: 'assign_id',
    properties: {
        assign_id: 'string',
        checkname: 'string',
        check_desc: 'string',
        outlet_id: 'string',
        start_time: 'string',
        end_time: 'string',
        assign_status: 'string',
        status: 'int'
    }
}

const ChekDetailSchema = {
    name: "CheckDetail",
    primaryKey: 'id',
    properties: {
        id: 'int',
        checkId: 'string',
        title: 'string',
    }
}

const CheckQASchema = {
    name: "CheckQA",
    primaryKey: 'id',
    properties: {
        id: 'int',
        check_id: 'string',
        quest_id: 'string',
        question: 'string',
        quest_type: 'string'
    }
}

const CheckAnsSchema = {
    name: 'CheckAns',
    properties: {
        quest_id: 'string',
        id: 'string',
        ans: 'string',
        min: 'string',
        max: 'string',
        is_acceptable: { type: 'bool', default: false },
        is_seleceted: { type: 'bool', default: false }
    }
}

const WebRequestSchema = {
    name: "WebRequest",
    primaryKey: 'id',
    properties: {
        id: 'int',
        url: 'string',
        body: 'string',
        isPending: { type: 'bool', default: true },
        isExecuted: { type: 'bool', default: false },
        isFailed: { type: 'bool', default: false },
    }
}

export default class LocalDBManager {

    NEW = 1; OPENED = 2; DONE = 3;
    PENDING = 4; ACCEPTED = 5; REJECTED = 6;
    APPROVED = 7; CANCELLED = 9;

    addNewChecks(checksData) {
        if (checksData !== undefined && checksData != null) {
            Realm.open({ schema: [CheckSchema] })
                .then(realm => {
                    checksData.map(item => {
                        let prevChecks = realm.objects("Check").filtered("assign_id = " + "'" + item.assign_id + "'")
                        if (prevChecks.isValid() && prevChecks.isEmpty()) {
                            realm.write(() => {
                                realm.create("Check", {
                                    assign_id: item.assign_id,
                                    checkname: item.checkname,
                                    check_desc: item.check_desc,
                                    outlet_id: item.outlet_id,
                                    start_time: item.start_time,
                                    end_time: item.end_time,
                                    assign_status: item.assign_status,
                                    status: this.NEW
                                })
                            })
                        } else {
                            realm.write(() => {
                                realm.delete(prevChecks)
                                realm.create("Check", {
                                    assign_id: item.assign_id,
                                    checkname: item.checkname,
                                    check_desc: item.check_desc,
                                    outlet_id: item.outlet_id,
                                    start_time: item.start_time,
                                    end_time: item.end_time,
                                    assign_status: item.assign_status,
                                    status: this.NEW
                                })
                            })
                        }
                    })
                })
                .catch(error => {
                    console.warn(error.message)
                })
        }
    }

    updateCheckStatus(status, checkId) {
        Realm.open({ schema: [CheckSchema] })
            .then(realm => {
                realm.write(() => {
                    realm.create("Check", { assign_id: checkId, status: status }, true)
                })
            })
            .catch(error => {
                console.warn(error.message)
            })
    }

    getAllChecks(onChecksData, onFailure) {
        Realm.open({ schema: [CheckSchema] })
            .then(realm => {
                const checks = realm.objects("Check")
                if (checks.isValid() && !checks.isEmpty()) {
                    onChecksData(checks)
                } else {
                    onFailure("")
                }
            })
            .catch(error => {
                console.log(error)
                onFailure(error.message)
            })
    }

    addNewCheckDetail(checkData) {
        Realm.open({ schema: [ChekDetailSchema, CheckQASchema, CheckAnsSchema] })
            .then(realm => {
                realm.write(() => {
                    checkData.map(data => {
                        let check = realm.create("CheckDetail", {
                            checkId: data.productid,
                            title: data.productname
                        })
                        checkData.questions.map(ques => {
                            let _ques = realm.create("CheckQA", {
                                check_id: check.checkId,
                                quest_id: ques.question_id,
                                question: ques.question_title,
                                quest_type: ques.question_type,
                            })
                            ques.answers.map(ans => {
                                let _ans = realm.create("CheckAns", {
                                    id: ans.answer_id,
                                    ans: ans.possible_answer,
                                    min: ans.min,
                                    max: ans.max,
                                    is_acceptable: ans.is_acceptable == "1"
                                })
                            })
                        })
                    })
                })
            })
            .catch(error => {
                console.warn(error.message)
            })
    }

    addNewWebRequest(url, body) {
        Realm.open({ schema: [WebRequestSchema] })
            .then(realm => {
                const lastObj = realm.objects("WebRequest").sorted("id", true)[0]
                const nextId = lastObj == null ? 0 : (lastObj.id + 1);
                realm.write(() => {
                    realm.create("WebRequest", {
                        id: nextId,
                        url: url,
                        body: body
                    })
                })
            })
            .catch(error => {
                console.warn(error.message)
            })
    }

    getAllPendingRequests(onRequestsData, onFailure) {
        Realm.open({ schema: [WebRequestSchema] })
            .then(realm => {
                const requests = realm.objects("WebRequest").filtered("isPending = true")
                if (requests.isValid() && !requests.isEmpty()) {
                    onRequestsData(requests)
                } else {
                    onFailure("")
                }
            })
            .catch(error => {
                console.log(error)
                onFailure(error.message)
            })
    }
}