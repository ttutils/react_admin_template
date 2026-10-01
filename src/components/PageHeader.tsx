import React from 'react';
import {Typography} from '@douyinfe/semi-ui';

interface PageHeaderProps {
    title: string;
    description?: React.ReactNode;
    icon?: React.ReactNode;
    actions?: React.ReactNode;
}

const {Title, Text} = Typography;

export default function PageHeader({title, description, icon, actions}: PageHeaderProps) {
    return (
        <div className="mb-4 flex min-h-11 flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
                {icon ? (
                    <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-(--semi-color-primary-light-active) bg-(--semi-color-primary-light-default) text-lg text-(--semi-color-primary) sm:size-10"
                        aria-hidden="true"
                    >
                        {icon}
                    </div>
                ) : null}
                <div className="min-w-0">
                    <Title heading={4} className="m-0! text-xl! leading-7! tracking-normal! text-(--semi-color-text-0)!">
                        {title}
                    </Title>
                    {description ? (
                        <Text type="tertiary" className="mt-0.5 block max-w-3xl whitespace-normal text-[13px]! leading-5 sm:truncate">
                            {description}
                        </Text>
                    ) : null}
                </div>
            </div>
            {actions ? (
                <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end [&_.semi-button]:w-full sm:[&_.semi-button]:w-auto">
                    {actions}
                </div>
            ) : null}
        </div>
    );
}
