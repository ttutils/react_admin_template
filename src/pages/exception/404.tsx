import {IllustrationNotFound, IllustrationNotFoundDark} from '@douyinfe/semi-illustrations';
import {Button, Empty, Typography} from '@douyinfe/semi-ui';
import {IconHome} from '@douyinfe/semi-icons';
import React from 'react';

const {Text, Title} = Typography;

export default function NotFound() {
    return (
        <main className="flex min-h-dvh w-full items-center justify-center bg-(--semi-color-bg-0) p-6">
            <Empty
                image={<IllustrationNotFound className="h-[220px] w-[220px]"/>}
                darkModeImage={<IllustrationNotFoundDark className="h-[220px] w-[220px]"/>}
                description={<div className="flex max-w-md flex-col gap-2 text-center"><Title heading={4}>页面不存在</Title><Text type="tertiary">您访问的页面不存在或已被移动，请检查地址后重试。</Text></div>}
            >
                <Button icon={<IconHome/>} onClick={() => location.href = '/'} type="primary" theme="solid">返回首页</Button>
            </Empty>
        </main>
    );
}
