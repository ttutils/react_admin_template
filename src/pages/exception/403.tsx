import {IllustrationNoAccess, IllustrationNoAccessDark} from '@douyinfe/semi-illustrations';
import {Button, Empty, Typography} from '@douyinfe/semi-ui';
import {IconHome} from '@douyinfe/semi-icons';
import React from 'react';

const {Text, Title} = Typography;

export default function Forbidden() {
    return (
        <main className="flex min-h-dvh w-full items-center justify-center bg-(--semi-color-bg-0) p-6">
            <Empty
                image={<IllustrationNoAccess className="h-[220px] w-[220px]"/>}
                darkModeImage={<IllustrationNoAccessDark className="h-[220px] w-[220px]"/>}
                description={<div className="flex max-w-md flex-col gap-2 text-center"><Title heading={4}>无权访问此页面</Title><Text type="tertiary">当前账号没有访问权限，请联系管理员或返回首页。</Text></div>}
            >
                <Button icon={<IconHome/>} onClick={() => location.href = '/'} type="primary" theme="solid">返回首页</Button>
            </Empty>
        </main>
    );
}
