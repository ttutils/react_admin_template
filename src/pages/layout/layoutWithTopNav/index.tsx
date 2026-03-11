import { Banner, Layout, Nav } from '@douyinfe/semi-ui';
import { IconSemiLogo } from '@douyinfe/semi-icons';
import { Outlet } from 'react-router-dom';
import { APP_NAME, DEMO_WARNING_TIP } from "@/src/config";
import Footer from "@/src/pages/layout/Footer";
import React, { useEffect } from "react";
import SwitchThemeButton from "@/src/components/SwitchThemeButton";
import { demoStatusStore } from "@/src/stores/useDemoStatusStore";

const LayoutWithTopNav = () => {
    useEffect(() => {
        document.title = `${APP_NAME} 管理后台`;
    }, []);

    return (
        <Layout className='bg-(--semi-color-tertiary-light-default) h-screen'>
            <Layout.Header>
                <Nav
                    mode='horizontal'
                    header={{
                        logo: <IconSemiLogo style={{height: "36px", fontSize: 36}}/>,
                        text: `${APP_NAME} 管理后台`,
                    }}
                    footer={<SwitchThemeButton/>}
                />
            </Layout.Header>
            {demoStatusStore.getState().is_demo && <Banner type="warning" description={DEMO_WARNING_TIP} />}
            <Layout.Content className='flex items-center justify-center w-screen mt-24'>
                <Outlet/>
            </Layout.Content>
            <Footer/>
        </Layout>
    );
};
export default LayoutWithTopNav;
