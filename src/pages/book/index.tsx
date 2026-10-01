import React, {useRef, useState} from 'react';
import {Button, Form, Input, Modal, Table} from '@douyinfe/semi-ui';
import type {ColumnProps} from '@douyinfe/semi-ui/lib/es/table';
import type {FormApi} from '@douyinfe/semi-ui/lib/es/form';
import {IconDelete, IconEdit, IconFile, IconPlus, IconRefresh, IconSearch} from '@douyinfe/semi-icons';
import useService from '@/src/hooks/useService';
import {BookService} from '@/src/services/book';
import type {AddBookParams, BookItem, UpdateBookParams} from '@/src/api/book/types';
import PageHeader from '@/src/components/PageHeader';
import DataTablePanel from '@/src/components/DataTablePanel';

const formatYear = (value: unknown): unknown => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        const month = String(value.getMonth() + 1).padStart(2, '0');
        return `${value.getFullYear()}-${month}`;
    }
    if (typeof value === 'string') {
        const match = value.match(/^(\d{4})(?:-(\d{1,2}))?/);
        if (match) return `${match[1]}-${String(match[2] || '01').padStart(2, '0')}`;
    }
    return value;
};

const BookPage = () => {
    const [pageSize, setPageSize] = useState(20);
    const [pageNum, setPage] = useState(1);
    const [queryParams, setQueryParams] = useState<{title?: string; author?: string}>({});
    const [titleInput, setTitleInput] = useState('');
    const [authorInput, setAuthorInput] = useState('');
    const serviceResponse = useService(() => BookService.list({
        page: pageNum,
        page_size: pageSize,
        ...queryParams,
    }), [pageNum, pageSize, queryParams]);
    const {data, loading} = serviceResponse[0];
    const refresh = serviceResponse[1];
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [modalRecord, setModalRecord] = useState<BookItem>();
    const [okLoading, setOkLoading] = useState(false);
    const formApi = useRef<FormApi>(null);
    const total = typeof data?.total === 'number' ? data.total : 0;

    const handleSearch = () => {
        setQueryParams({title: titleInput || undefined, author: authorInput || undefined});
        setPage(1);
    };

    const handleReset = () => {
        setQueryParams({});
        setTitleInput('');
        setAuthorInput('');
        setPage(1);
    };

    const handleDelete = (record: BookItem) => {
        Modal.confirm({
            title: '删除图书',
            content: `确定要删除《${record.title}》吗？此操作不可撤销。`,
            okButtonProps: {type: 'danger'},
            onOk: async () => {
                const success = await BookService.delete({book_id: String(record.book_id)});
                if (success) refresh();
            },
        });
    };

    const handleSubmit = async () => {
        if (!formApi.current) return;
        if (modalType === 'edit' && !modalRecord) return;
        const values = await formApi.current.validate();
        values.year = formatYear(values.year);
        setOkLoading(true);
        try {
            const success = modalType === 'create'
                ? await BookService.add(values as AddBookParams)
                : await BookService.update(modalRecord!.book_id, values as UpdateBookParams);
            if (success) {
                refresh();
                setVisible(false);
            }
        } finally {
            setOkLoading(false);
        }
    };

    const columns: ColumnProps<BookItem>[] = [
        {title: 'ID', dataIndex: 'book_id', width: 120},
        {title: '书名', dataIndex: 'title', width: 180},
        {title: '作者', dataIndex: 'author', width: 160},
        {title: '概述', dataIndex: 'summary', width: 360},
        {title: '出版年份', dataIndex: 'year', width: 140},
        {
            title: '操作',
            dataIndex: 'actions',
            align: 'right',
            width: 180,
            render: (_text: string, record: BookItem) => (
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                    <Button
                        icon={<IconEdit/>}
                        type="primary"
                        theme="borderless"
                        size="small"
                        title="编辑图书"
                        onClick={() => {
                            setModalType('edit');
                            setModalRecord(record);
                            setVisible(true);
                        }}
                    >
                        编辑
                    </Button>
                    <Button
                        icon={<IconDelete/>}
                        type="danger"
                        theme="borderless"
                        size="small"
                        title="删除图书"
                        onClick={() => handleDelete(record)}
                    >
                        删除
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="mx-auto min-h-full w-full max-w-[1560px] px-3 pb-6 pt-4 sm:px-5 lg:px-7 lg:pb-8 lg:pt-6">
            <PageHeader
                title="图书管理"
                icon={<IconFile/>}
                actions={(
                    <Button
                        icon={<IconPlus/>}
                        type="primary"
                        theme="solid"
                        onClick={() => {
                            setModalType('create');
                            setModalRecord(undefined);
                            setVisible(true);
                        }}
                    >
                        新增图书
                    </Button>
                )}
            />

            <div className="mb-3 flex w-full flex-col gap-2 rounded-lg border border-(--semi-color-border) bg-(--semi-color-bg-0) p-2.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1 lg:flex-nowrap">
                    <Input
                        className="w-full! sm:w-60!"
                        value={titleInput}
                        onChange={setTitleInput}
                        onEnterPress={handleSearch}
                        prefix={<IconSearch/>}
                        placeholder="搜索书名"
                        showClear
                    />
                    <Input
                        className="w-full! sm:w-52!"
                        value={authorInput}
                        onChange={setAuthorInput}
                        onEnterPress={handleSearch}
                        prefix={<IconSearch/>}
                        placeholder="搜索作者"
                        showClear
                    />
                    <Button icon={<IconSearch/>} type="primary" theme="solid" onClick={handleSearch}>查询</Button>
                    <Button icon={<IconRefresh/>} type="tertiary" theme="light" onClick={handleReset}>重置</Button>
                </div>
                <div className="flex w-full items-center justify-end lg:w-auto">
                    <span className="whitespace-nowrap text-[13px] text-(--semi-color-text-2)">共 {total} 本图书</span>
                </div>
            </div>

            <DataTablePanel>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={data?.data || []}
                    rowKey="book_id"
                    size="small"
                    pagination={{
                        pageSize,
                        total,
                        currentPage: pageNum,
                        showSizeChanger: true,
                        hoverShowPageSelect: true,
                        pageSizeOpts: [20, 50, 100],
                        onChange: (page: number, nextPageSize: number) => {
                            setPage(page);
                            setPageSize(nextPageSize);
                        },
                    }}
                    scroll={{x: 900}}
                />
            </DataTablePanel>

            <Modal
                className="[&_.semi-modal]:mx-3! [&_.semi-modal]:max-w-[calc(100vw-1.5rem)]! sm:[&_.semi-modal]:mx-auto! sm:[&_.semi-modal]:max-w-[620px]! [&_.semi-modal-content]:rounded-lg! [&_.semi-modal-header]:border-b! [&_.semi-modal-header]:border-(--semi-color-border)! [&_.semi-modal-header]:pb-3.5! [&_.semi-modal-footer]:flex! [&_.semi-modal-footer]:items-center! [&_.semi-modal-footer]:justify-end! [&_.semi-modal-footer]:gap-2! [&_.semi-modal-footer]:border-t! [&_.semi-modal-footer]:border-(--semi-color-border)! [&_.semi-modal-footer]:pt-3.5! [&_.semi-modal-footer_.semi-button]:m-0!"
                title={modalType === 'create' ? '新增图书' : '编辑图书'}
                width={620}
                visible={visible}
                onCancel={() => {
                    if (!okLoading) setVisible(false);
                }}
                onOk={handleSubmit}
                okButtonProps={{loading: okLoading}}
                maskClosable={false}
            >
                <Form
                    key={`${modalType}-${modalRecord?.book_id || 'new'}`}
                    layout="vertical"
                    initValues={modalRecord}
                    getFormApi={api => formApi.current = api as FormApi}
                >
                    <Form.Input field="title" label="书名" rules={[{required: true, message: '请输入书名'}]} showClear/>
                    <Form.Input field="author" label="作者" rules={[{required: true, message: '请输入作者'}]} showClear/>
                    <Form.TextArea field="summary" label="概述" rules={[{required: true, message: '请输入概述'}]} showClear rows={4}/>
                    <Form.DatePicker
                        field="year"
                        label="出版年份"
                        type="month"
                        rules={[{required: true, message: '请选择年份'}]}
                        showClear
                        insetInput
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default BookPage;
