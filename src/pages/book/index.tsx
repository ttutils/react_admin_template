import React, { useRef, useState } from "react";
import { Table, Button, Modal, Form, Input } from "@douyinfe/semi-ui";
import useService from "@/src/hooks/useService";
import { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { BookService } from "@/src/services/book";
import { IconRefresh } from "@douyinfe/semi-icons";
import dayjs from "dayjs";

const BookPage = () => {
    const pageSize: number = 8;
    const [pageNum, setPage] = useState(1);
    const [queryParams, setQueryParams] = useState<{ title?: string; author?: string }>({});
    const [titleInput, setTitleInput] = useState('');
    const [authorInput, setAuthorInput] = useState('');
    const serviceResponse = useService(() => BookService.list({
        page: pageNum,
        page_size: pageSize, ...queryParams
    }), [pageNum, queryParams]);
    const {data, loading} = serviceResponse[0];
    const refresh = serviceResponse[1];
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [modalRecord, setModalRecord] = useState<any>();
    const [okLoading, setOkLoading] = useState(false)
    const formApi = useRef<FormApi>();

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？',
            onOk: async () => {
                await BookService.delete({book_id: id});
                refresh();
            }
        });
    };

    const handleSubmit = async () => {
        if (!formApi.current) return;
        const values = await formApi.current.validate();
        values.year = dayjs(values.year).format('YYYY-MM')
        setOkLoading(true);
        try {
            if (modalType === 'create') {
                await BookService.add(values);
            } else {
                await BookService.update(modalRecord.book_id, values);
            }
            refresh();
            setVisible(false);
        } finally {
            setOkLoading(false);
        }
    };

    const openCreateModal = () => {
        setModalType('create');
        setModalRecord(undefined);
        setVisible(true);
    };

    const editInfo = (record: any) => {
        setModalType('edit');
        setModalRecord(record);
        setVisible(true);
    };

    const columns: ColumnProps[] = [
        {
            title: "id",
            dataIndex: "book_id",
            render: (id: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{id}</span>
                </div>
            ),
        },
        {
            title: "书名",
            dataIndex: "title",
            render: (text: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "作者",
            dataIndex: "author",
            render: (text: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "概述",
            dataIndex: "summary",
            render: (text: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "出版年份",
            dataIndex: "year",
            render: (text: number, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "操作",
            dataIndex: "actions",
            align: 'center',
            render: (_text: string, record: any, _index: any) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <Button type="primary" theme='solid' onClick={() => editInfo(record)}>编辑</Button>
                        <Button type="danger" theme='solid' onClick={() => handleDelete(record.book_id)}>删除</Button>
                    </div>
                );
            },
        },
    ];

    return (
        <div>
            <div className="flex flex-col gap-4 p-4">
                <div className="flex justify-between items-center p-4 rounded-lg shadow-sm">
                    <div className="flex gap-2">
                        <Input
                            value={titleInput}
                            onChange={value => setTitleInput(value)}
                            placeholder='书名'
                        ></Input>
                        <Input
                            value={authorInput}
                            onChange={value => setAuthorInput(value)}
                            placeholder='作者'
                        ></Input>
                        <Button type="primary" theme="solid" onClick={() => {
                            setQueryParams({
                                title: titleInput || undefined,
                                author: authorInput || undefined
                            });
                            setPage(1);
                        }}>查询</Button>
                        <Button icon={<IconRefresh/>} type="primary" theme="solid" onClick={() => {
                            setQueryParams({});
                            setTitleInput('');
                            setAuthorInput('');
                            setPage(1);
                        }}>清空刷新</Button>
                    </div>
                    <div className="flex gap-2">
                        <Button type="primary" theme="solid" onClick={openCreateModal}>新增</Button>
                    </div>
                </div>
                <div className="rounded-lg shadow-sm p-4">
                    <Table
                        loading={loading}
                        columns={columns}
                        dataSource={data?.data}
                        bordered
                        pagination={{
                            pageSize,
                            total: data?.total,
                            currentPage: pageNum,
                            className: 'px-4 mt-4',
                            onChange: (page: number) => {
                                setPage(page)
                            },
                        }}
                    />
                </div>
            </div>
            <Modal
                title={
                    modalType === 'create' ? '新增书籍' : '编辑书籍信息'
                }
                size="large"
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={handleSubmit}
                okButtonProps={{loading: okLoading}}
            >
                <Form
                    labelPosition='left'
                    labelAlign='left'
                    labelWidth={100}
                    initValues={modalRecord}
                    getFormApi={api => formApi.current = api}
                >
                    <Form.Input
                        field='title'
                        label='书名'
                        rules={[{required: true, message: '请输入书名'}]}
                    />
                    <Form.Input
                        field='author'
                        label='作者'
                        rules={[{required: true, message: '请输入作者'}]}
                    />
                    <Form.Input
                        field='summary'
                        label='概述'
                        rules={[{required: true, message: '请输入概述'}]}
                    />
                    <Form.DatePicker
                        field='year'
                        label='出版年份'
                        type='month'
                        rules={[{required: true, message: '请选择年份'}]}
                        insetInput
                    />
                </Form>
            </Modal>
        </div>
    );
};

export default BookPage;
