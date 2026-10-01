import {Banner, Layout, Nav} from '@douyinfe/semi-ui';
import {IconSemiLogo} from '@douyinfe/semi-icons';
import {Outlet} from 'react-router-dom';
import {APP_LOGIN_REDIRECT_URI, APP_NAME, DEMO_WARNING_TIP} from '@/src/config';
import Footer from '@/src/pages/layout/Footer';
import React, {useEffect} from 'react';
import SwitchThemeButton from '@/src/components/SwitchThemeButton';
import {demoStatusStore} from '@/src/stores/useDemoStatusStore';

const LayoutWithTopNav = () => {
    const isDemo = demoStatusStore(state => state.is_demo);

    useEffect(() => {
        document.title = `登录 - ${APP_NAME}`;
    }, []);

    return (
        <Layout className="flex min-h-dvh! w-full flex-col overflow-x-hidden bg-(--semi-color-bg-0)">
            <Layout.Header className="min-h-[58px] shrink-0 border-b border-(--semi-color-border) bg-(--semi-color-bg-1)">
                <Nav
                    className="h-[58px]! min-w-0 bg-(--semi-color-bg-1) px-3.5!"
                    mode="horizontal"
                    header={{
                        className: 'inline-flex min-w-0 cursor-pointer items-center gap-2.5 text-(--semi-color-text-0)',
                        logo: <IconSemiLogo className="h-8! w-8! shrink-0" aria-hidden="true"/>,
                        text: <span className="max-w-[280px] truncate text-[15px] font-semibold leading-[22px]">{APP_NAME} 管理后台</span>,
                        link: APP_LOGIN_REDIRECT_URI,
                        linkOptions: {'aria-label': `前往 ${APP_NAME} 管理后台`},
                    }}
                    footer={<div className="flex min-w-0 items-center gap-1"><SwitchThemeButton/></div>}
                />
            </Layout.Header>
            {isDemo ? <Banner className="shrink-0" type="warning" description={DEMO_WARNING_TIP}/> : null}
            <Layout.Content className="flex min-h-0! w-full flex-1! items-center justify-center bg-(--semi-color-bg-0) px-5 py-8 [background-image:linear-gradient(var(--semi-color-border)_1px,transparent_1px),linear-gradient(90deg,var(--semi-color-border)_1px,transparent_1px)] [background-position:center_center] [background-size:32px_32px]">
                <Outlet/>
            </Layout.Content>
            <Footer/>
        </Layout>
    );
};

export default LayoutWithTopNav;
