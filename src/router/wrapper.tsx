/**
 * @description 路由组件包裹页，用于重定向和鉴权等
 */
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '@/src/utils/auth';

interface IProps {
    component: JSX.Element;
    auth?: boolean;
}

const Wrapper = ( props: IProps ): JSX.Element => {
    const {component, auth = false} = props;
    const {pathname} = useLocation();
    const token = getToken();

    // 登录校验
    if (auth && token == null) {
        return <Navigate to='/user/login'/>
    }

    // 重定向
    if (pathname === '/' || pathname === 'dashboard' || pathname === 'user/login') {
        return <Navigate to='/home'/>
    } else {
        return component;
    }
};

export default Wrapper;