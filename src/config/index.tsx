export const APP_NAME: string = 'react_admin_template';
export const APP_START_YEAR: number = 2025;
export const APP_LOGIN_REDIRECT_URI: string = '/home';
export const APP_LOGIN_URI: string = '/user/login';
export const CHECK_TOKEN_TIME_INTERVAL: number = 1000 * 5; // 5秒
export const DEMO_WARNING_TIP: string = '当前为演示环境，请勿输入真实数据，整库数据1小时删除一次';
export const NO_CHECK_PATH_LIST: string[] = ['/', 'user/login'];
export const NO_TOKEN_API_LIST: string[] = [
    "/api/user/login",
    "/api/ping",
    "/api/metrics",
    "/api/server_info",
    "/api/is_demo",
];