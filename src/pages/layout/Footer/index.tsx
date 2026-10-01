import React from 'react';
import {Layout, Typography} from '@douyinfe/semi-ui';
import {APP_START_YEAR} from '@/src/config';
import {serverInfoStore} from '@/src/stores/useServerInfoStore';

const {Text} = Typography;

export default function Footer() {
    const year = new Date().getFullYear();
    const version = serverInfoStore(state => state.version);
    const yearLabel = year === APP_START_YEAR ? APP_START_YEAR : `${APP_START_YEAR} - ${year}`;
    const versionLabel = version.startsWith('v') ? version : `v${version}`;

    return (
        <Layout.Footer className="flex min-h-[38px] items-center justify-center border-t border-(--semi-color-border) bg-(--semi-color-bg-1) px-4 py-1.5 text-center text-xs leading-5">
            <Text className="inline-flex flex-wrap items-center justify-center gap-[7px]" type="tertiary" size="small">
                <span>{versionLabel}</span>
                <span className="text-(--semi-color-text-3)" aria-hidden="true"> · </span>
                <span>© {yearLabel}</span>
                <span className="text-(--semi-color-text-3)" aria-hidden="true"> · </span>
                <a className="text-(--semi-color-primary) hover:underline" href="https://github.com/buyfakett" target="_blank" rel="noreferrer">buyfakett</a>
            </Text>
        </Layout.Footer>
    );
}
