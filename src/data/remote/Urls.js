//  const SERVER = "https://qa.hwryk.com/"
// const SERVER = "https://lantixapp1.lantix.com/"
// const SERVER = "https://eqcheck.valleyfine.com/"
// const SERVER = "https://eqsmart.alchemy20.com/"
// const SERVER = "https://eqs.alchemy20.com/"

import AppConfig from "../../utils/AppConfig"

const SERVER = AppConfig.SERVER_IP

export default {
    LOGIN_URL: SERVER + "outlet-admin-login",
    CHECKS_LIST_URL: SERVER + "get-checklists-data",
    CHECK_LIST_DETAIL_URL: SERVER + "checklists-detail",
    SUBMIT_CHECK_URL: SERVER + "submit-assignment-answer",
    USER_NOTIFICATIONS_URL: SERVER + "get-user-notification",
    SUBMIT_AS_REVIEWED_URL: SERVER + "change-status-for-review",
    ALL_USERS_CONTACTS_URL: SERVER + "get-users-list",
    UPDATE_PASSWORD_URL: SERVER + "update-user-password",
    UPDATE_PROFILE_INFO_URL: SERVER + "user-profile-update",
    UPDATE_PROFILE_PIC_URL: SERVER + "user-picture-update",
    LOGOUT_USER_URL: SERVER + "mobile-user-logout",
    CHAT_HISTORY_URL: SERVER + "user-chat-list",
    SEND_MESSAGE_URL: SERVER + "send-user-message",
    SUBMIT_AS_ACCEPTED_URL: SERVER + "change-status-for-approve",
    UPLOAD_MEDIA_URL: SERVER + "submit-media-file",
    DELETE_MEDIA_URL: SERVER + "delete-media-file",
    FIXED_CHECKS_LIST_URL: SERVER + "get-fixed-forms",
    FIXED_CHECK_DATA_URL: SERVER + "get-fixed-forms-detail",
    SUBMIT_FIXED_FORM_DATA_URL: SERVER + "fixed-form-response",
    GET_LINE_PRODUCTS_URL: SERVER + "get-products-lists",
    SUBMIT_FIXED_FORM_AS_DRAFT_URL: SERVER + "submit-draft",
    GET_FIXED_FORM_DRAFT_URL: SERVER + "draft-checks",
    GET_FIXED_FORM_DRAFT_DETAIL_URL: SERVER + "draft-checks-detail",
    UPDATE_CHAT_MESSAGE_STATUS_URL: SERVER + "change-messages-status-of-user",
    UPLOAD_STATIC_FORM_MEDIA_URL: SERVER + "static-media-file"
}