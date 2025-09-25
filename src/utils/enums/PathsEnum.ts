export enum PathsEnum {
    TEST = '/test',

    ADMIN_BASE_ROUTE = '/admin/sessions',
    ADMIN_SESSION_STATS = '/stats',
    ADMIN_SESSION_CLEANUP = '/cleanup',
    ADMIN_SESSION_CLEAR = '/clear',
    ADMIN_SESSION_RESTART_CLEANUP = '/restart-cleanup',

    USER_BASE_ROUTE = '/users',
    CREATE_NEW_USER = '/create-new-user',
    LOGIN_USER = '/login-user',
    LOGOUT_USER = '/logout-user',
    REFRESH_TOKEN = '/refresh-token',
    USER_UPDATED_PASSWORD = '/user-updated-password',
    USER_UPDATED_INFOS = '/user-updated-infos',
    USER_DELETED_ACCOUNT = '/user-delete-account',
    USER_VERIFY_EMAIL = '/user-verify-email',
}