import React, {Suspense, useEffect, useRef, useState} from 'react';
import {Avatar, Button, Dropdown, Form, Layout as MainLayout, Modal, Nav, Spin} from '@douyinfe/semi-ui';
import {IconChevronDown, IconExit, IconKey, IconUser, IconSemiLogo} from '@douyinfe/semi-icons';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';
import {AnimatePresence, motion, useReducedMotion} from 'motion/react';
import {defaultOpenKeys, MenuRoutes, type IRouters} from '@/src/router/routes';
import type {OnSelectedData} from '@douyinfe/semi-ui/lib/es/navigation';
import {getUserid, getUsername} from '@/src/utils/auth';
import {APP_LOGIN_REDIRECT_URI, APP_LOGIN_URI, APP_NAME} from '@/src/config';
import Footer from '@/src/pages/layout/Footer';
import ChangePasswordModal from '@/src/components/ChangePasswordModal';
import SwitchThemeButton from '@/src/components/SwitchThemeButton';
import {UserService} from '@/src/services/user';
import type {FormApi} from '@douyinfe/semi-ui/lib/es/form';
import type {UserInfo} from '@/src/api/user/types';

const {Header, Sider, Content} = MainLayout;
const SIDEBAR_COLLAPSE_QUERY = '(max-width: 1024px)';
const SIDEBAR_LOCK_QUERY = '(max-width: 720px)';

const normalizePath = (pathname: string) => pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;

const findMenuTitle = (pathname: string, items: IRouters[] = MenuRoutes): string | undefined => {
    for (const item of items) {
        if (item.itemKey === pathname) return item.text;
        if (item.items) {
            const nestedTitle = findMenuTitle(pathname, item.items);
            if (nestedTitle) return nestedTitle;
        }
    }
    return undefined;
};

const getRouteTitle = (pathname: string) => findMenuTitle(pathname) ?? '管理后台';

export default function Layout() {
    const navigate = useNavigate();
    const {pathname} = useLocation();
    const normalizedPath = normalizePath(pathname);
    const reduceMotion = useReducedMotion();
    const [isCollapsed, setIsCollapsed] = useState(() => typeof window !== 'undefined' && window.matchMedia(SIDEBAR_COLLAPSE_QUERY).matches);
    const [isSidebarLocked, setIsSidebarLocked] = useState(() => typeof window !== 'undefined' && window.matchMedia(SIDEBAR_LOCK_QUERY).matches);
    const changePasswordRef = useRef<{open: (userId: string) => void}>(null);
    const [visible, setVisible] = useState(false);
    const formApi = useRef<FormApi>(null);
    const [okLoading, setOkLoading] = useState(false);
    const [modalRecord, setModalRecord] = useState<UserInfo>();
    const username = getUsername() || '用户';
    const avatarText = username.trim().slice(0, 1).toUpperCase() || 'U';

    useEffect(() => {
        document.title = `${getRouteTitle(normalizedPath)} - ${APP_NAME}`;
    }, [normalizedPath]);

    useEffect(() => {
        const mediaQuery = window.matchMedia(SIDEBAR_COLLAPSE_QUERY);
        const handleViewportChange = (event: MediaQueryListEvent) => setIsCollapsed(event.matches);
        setIsCollapsed(mediaQuery.matches);
        mediaQuery.addEventListener('change', handleViewportChange);
        return () => mediaQuery.removeEventListener('change', handleViewportChange);
    }, []);

    useEffect(() => {
        const mediaQuery = window.matchMedia(SIDEBAR_LOCK_QUERY);
        const handleSidebarLock = (event: MediaQueryListEvent) => {
            setIsSidebarLocked(event.matches);
            if (event.matches) setIsCollapsed(true);
        };
        setIsSidebarLocked(mediaQuery.matches);
        if (mediaQuery.matches) setIsCollapsed(true);
        mediaQuery.addEventListener('change', handleSidebarLock);
        return () => mediaQuery.removeEventListener('change', handleSidebarLock);
    }, []);

    const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigate(APP_LOGIN_REDIRECT_URI);
    };

    const changePasswd = () => changePasswordRef.current?.open(getUserid());
    const logout = () => {
        void UserService.logout();
        navigate(APP_LOGIN_URI);
    };
    const onSelect = (data: OnSelectedData) => navigate(data.itemKey as string);

    const changeInfo = async () => {
        setOkLoading(true);
        try {
            const userData = await UserService.info(getUserid());
            if (userData) {
                setModalRecord(userData);
                formApi.current?.setValues(userData);
                setVisible(true);
            }
        } finally {
            setOkLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!formApi.current) return;
        const values = await formApi.current.validate();
        setOkLoading(true);
        try {
            const userId = modalRecord?.user_id || getUserid();
            if (!userId) return;
            const success = await UserService.update(userId, values);
            if (success) setVisible(false);
        } finally {
            setOkLoading(false);
        }
    };

    return (
        <>
            <MainLayout className="flex h-dvh min-h-dvh! w-full flex-col overflow-hidden bg-(--semi-color-bg-0)">
                <Header className="min-h-[58px] shrink-0 border-b border-(--semi-color-border) bg-(--semi-color-bg-1)">
                    <Nav
                        className="h-[58px]! min-w-0 bg-(--semi-color-bg-1) px-3.5!"
                        mode="horizontal"
                        header={{
                            className: 'inline-flex min-w-0 cursor-pointer items-center gap-2.5 text-(--semi-color-text-0)',
                            logo: <IconSemiLogo className="h-8! w-8! shrink-0" aria-hidden="true"/>,
                            text: <span className="max-w-[280px] truncate text-[15px] font-semibold leading-[22px]">{APP_NAME} 管理后台</span>,
                            link: APP_LOGIN_REDIRECT_URI,
                            linkOptions: {'aria-label': `返回 ${APP_NAME} 首页`, onClick: handleBrandClick},
                        }}
                        footer={(
                            <div className="flex min-w-0 items-center gap-1">
                                <SwitchThemeButton/>
                                <Dropdown
                                    trigger="click"
                                    position="bottomRight"
                                    render={(
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon={<IconKey/>} onClick={changePasswd}>修改密码</Dropdown.Item>
                                            <Dropdown.Item icon={<IconUser/>} onClick={changeInfo}>修改信息</Dropdown.Item>
                                            <Dropdown.Divider/>
                                            <Dropdown.Item type="danger" icon={<IconExit/>} onClick={logout}>退出登录</Dropdown.Item>
                                        </Dropdown.Menu>
                                    )}
                                >
                                    <Button
                                        className="max-w-[220px] [&_.semi-button-content-left]:min-w-0"
                                        theme="borderless"
                                        type="tertiary"
                                        icon={<Avatar size="extra-small" color="blue">{avatarText}</Avatar>}
                                        aria-label={`打开 ${username} 的用户菜单`}
                                    >
                                        <span className="max-w-[126px] truncate">{username}</span>
                                        <IconChevronDown size="small"/>
                                    </Button>
                                </Dropdown>
                            </div>
                        )}
                    />
                </Header>
                <MainLayout className="min-h-0! flex-1! overflow-hidden">
                    <div className="flex min-h-0 min-w-0 flex-1">
                        <Sider className={`h-full shrink-0 overflow-hidden border-r border-(--semi-color-border) bg-(--semi-color-bg-1) transition-[width,min-width,max-width] duration-150 ease-in-out ${isCollapsed ? 'w-[60px]! min-w-[60px]! max-w-[60px]! basis-[60px]!' : 'w-[240px]! min-w-[240px]! max-w-[240px]! basis-[240px]!'}`}>
                            <Nav
                                className="h-full w-full bg-(--semi-color-bg-1)"
                                mode="vertical"
                                isCollapsed={isCollapsed}
                                onCollapseChange={collapsed => setIsCollapsed(isSidebarLocked ? true : collapsed)}
                                selectedKeys={[normalizedPath]}
                                items={MenuRoutes}
                                onSelect={onSelect}
                                defaultOpenKeys={defaultOpenKeys}
                                renderWrapper={({itemElement, props}) => React.cloneElement(itemElement, {
                                    onMouseDown: (event: React.MouseEvent) => {
                                        if (event.button === 1 && props.itemKey) {
                                            event.preventDefault();
                                            window.open(String(props.itemKey), '_blank');
                                        }
                                    },
                                })}
                                footer={{collapseButton: !isSidebarLocked}}
                            />
                        </Sider>
                        <Content className="min-h-0! min-w-0 flex-1! overflow-x-hidden overflow-y-auto bg-(--semi-color-bg-1)">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.div
                                    className="min-h-full min-w-0"
                                    key={normalizedPath}
                                    initial={reduceMotion ? false : {opacity: 0, y: 4}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={reduceMotion ? undefined : {opacity: 0, y: -2}}
                                    transition={{duration: reduceMotion ? 0 : 0.16, ease: 'easeOut'}}
                                >
                                    <Suspense fallback={<div className="flex min-h-[45vh] w-full items-center justify-center" role="status"><Spin size="large"/></div>}>
                                        <Outlet/>
                                    </Suspense>
                                </motion.div>
                            </AnimatePresence>
                        </Content>
                    </div>
                </MainLayout>
                <Footer/>
            </MainLayout>
            <Modal
                className="[&_.semi-modal]:!w-[min(520px,calc(100vw-24px))] [&_.semi-modal]:!max-w-[calc(100vw-24px)] [&_.semi-modal-content]:rounded-lg! [&_.semi-modal-header]:border-b! [&_.semi-modal-header]:border-(--semi-color-border)! [&_.semi-modal-header]:pb-3.5! [&_.semi-modal-body]:max-h-[calc(100dvh-220px)] [&_.semi-modal-body]:overflow-y-auto! [&_.semi-modal-footer]:flex! [&_.semi-modal-footer]:items-center! [&_.semi-modal-footer]:justify-end! [&_.semi-modal-footer]:gap-2! [&_.semi-modal-footer]:border-t! [&_.semi-modal-footer]:border-(--semi-color-border)! [&_.semi-modal-footer]:pt-3.5! [&_.semi-modal-footer_.semi-button]:m-0!"
                title="编辑用户信息"
                visible={visible}
                onCancel={() => {
                    if (!okLoading) setVisible(false);
                }}
                onOk={handleSubmit}
                okButtonProps={{loading: okLoading}}
                maskClosable={false}
            >
                <Form layout="vertical" initValues={modalRecord} getFormApi={api => formApi.current = api}>
                    <Form.Input field="username" label="用户名" rules={[{required: true, message: '请输入用户名'}]} showClear/>
                </Form>
            </Modal>
            <ChangePasswordModal ref={changePasswordRef}/>
        </>
    );
}
