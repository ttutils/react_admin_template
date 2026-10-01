import type {PropsWithChildren} from 'react';

interface DataTablePanelProps extends PropsWithChildren {
    className?: string;
}

const TABLE_PANEL_CLASSES = [
    'w-full min-w-0 overflow-hidden rounded-lg border border-(--semi-color-border)',
    'bg-(--semi-color-bg-0) shadow-sm',
    '[&_.semi-table-wrapper]:w-full!',
    '[&_.semi-table-container]:w-full! [&_.semi-table-container]:overflow-x-auto!',
    '[&_.semi-table]:min-w-full!',
    '[&_.semi-table-thead>.semi-table-row>.semi-table-row-head]:border-b-(--semi-color-border)!',
    '[&_.semi-table-thead>.semi-table-row>.semi-table-row-head]:bg-(--semi-color-fill-0)!',
    '[&_.semi-table-thead>.semi-table-row>.semi-table-row-head]:font-semibold!',
    '[&_.semi-table-thead>.semi-table-row>.semi-table-row-head]:text-(--semi-color-text-1)!',
    '[&_.semi-table-tbody>.semi-table-row>.semi-table-row-cell]:border-b-(--semi-color-border)!',
    '[&_.semi-table-tbody>.semi-table-row:hover>.semi-table-row-cell]:bg-(--semi-color-fill-0)!',
    '[&_.semi-table-pagination-outer]:flex! [&_.semi-table-pagination-outer]:items-center!',
    '[&_.semi-table-pagination-outer]:justify-between! [&_.semi-table-pagination-outer]:gap-3!',
    '[&_.semi-table-pagination-outer]:p-3! sm:[&_.semi-table-pagination-outer]:p-4!',
    '[&_.semi-page]:m-0! [&_.semi-page]:flex! [&_.semi-page]:flex-wrap! [&_.semi-page]:gap-y-2!',
    '[&_.semi-page-total]:whitespace-nowrap! [&_.semi-page-switch]:whitespace-nowrap!',
].join(' ');

export default function DataTablePanel({children, className = ''}: DataTablePanelProps) {
    return (
        <div className={`${TABLE_PANEL_CLASSES} ${className}`.trim()}>
            {children}
        </div>
    );
}
