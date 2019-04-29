const SERVER = "https://qa.hwryk.com/"

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
}