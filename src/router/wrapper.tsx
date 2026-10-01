/** 路由鉴权、持久化状态恢复与公开路径重定向。 */
import React, {JSX, useEffect, useState} from 'react';
import {Spin} from '@douyinfe/semi-ui';
import {Navigate, useLocation} from 'react-router-dom';
import {APP_LOGIN_REDIRECT_URI, APP_LOGIN_URI, NO_CHECK_PATH_LIST} from '@/src/config';
import {authStore} from '@/src/stores/useAuthStore';

interface IProps {
    component: JSX.Element;
    auth?: boolean;
}

const Wrapper = ({component, auth = false}: IProps): JSX.Element => {
    const {pathname} = useLocation();
    const token = authStore(state => state.token);
    const [hasHydrated, setHasHydrated] = useState(authStore.persist.hasHydrated());

    useEffect(() => {
        const unsubscribe = authStore.persist.onFinishHydration(() => setHasHydrated(true));
        if (authStore.persist.hasHydrated()) setHasHydrated(true);
        else void authStore.persist.rehydrate();
        return unsubscribe;
    }, []);

    if (auth && !hasHydrated) {
        return (
            <div className="flex min-h-dvh w-full items-center justify-center bg-(--semi-color-bg-1)" role="status" aria-label="正在恢复登录状态">
                <Spin size="large"/>
            </div>
        );
    }

    if (auth && token == null) return <Navigate to={APP_LOGIN_URI}/>;
    if (NO_CHECK_PATH_LIST.includes(pathname)) return <Navigate to={APP_LOGIN_REDIRECT_URI}/>;
    return component;
};

export default Wrapper;
