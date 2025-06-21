import React, { useRef, useState } from "react";
import { Table, Button, Modal, Form, Input } from "@douyinfe/semi-ui";
import useService from "@/src/hooks/useService";
import { ColumnProps } from "@douyinfe/semi-ui/lib/es/table";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form";
import { IconRefresh } from "@douyinfe/semi-icons";
import { UserService } from "@/src/services/user";
import ChangePasswordModal from "@/src/components/ChangePasswordModal";
import { AddUserParams } from "@/src/api/user/types";

const UserPage = () => {
    const pageSize: number = 8;
    const [pageNum, setPage] = useState(1);
    const [queryParams, setQueryParams] = useState<{ username?: string; email?: string }>({});
    const [usernameInput, setUsernameInput] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const serviceResponse = useService(() => UserService.list({
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
    const changePasswordRef = useRef<{ open: (userId: string) => void }>(null);

    // 显示弹窗
    const changePasswd = (userId: string) => {
        changePasswordRef.current?.open(userId);
    };

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: '确认删除',
            content: '确定要删除这条记录吗？',
            onOk: async () => {
                await UserService.delete({user_id: id});
                refresh();
            }
        });
    };

    const handleSubmit = async () => {
        if (!formApi.current) return;
        const values = await formApi.current.validate();
        setOkLoading(true);
        try {
            if (modalType === 'create') {
                await UserService.add(values as AddUserParams);
            } else {
                await UserService.update(modalRecord.user_id, values);
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
            dataIndex: "user_id",
            width: '10%',
            render: (id: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{id}</span>
                </div>
            ),
        },
        {
            title: "用户名",
            dataIndex: "username",
            width: '30%',
            render: (text: string, record: { cover: string }) => (
                <div className="flex items-center">
                    <span className="font-medium">{text}</span>
                </div>
            ),
        },
        {
            title: "邮箱",
            dataIndex: "email",
            width: '30%',
            render: (text: string, record: { cover: string }) => (
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
                        <Button type="primary" theme='solid'
                                onClick={() => changePasswd(record.user_id)}>修改密码</Button>
                        <Button
                            type="danger"
                            theme="solid"
                            disabled={record.user_id === '1'}
                            onClick={() => handleDelete(record.user_id)}
                        >
                            删除
                        </Button>
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
                            value={usernameInput}
                            onChange={value => setUsernameInput(value)}
                            placeholder='用户名'
                        ></Input>
                        <Input
                            value={emailInput}
                            onChange={value => setEmailInput(value)}
                            placeholder='邮箱'
                        ></Input>
                        <Button type="primary" theme="solid" onClick={() => {
                            setQueryParams({
                                username: usernameInput || undefined,
                                email: emailInput || undefined
                            });
                            setPage(1);
                        }}>查询</Button>
                        <Button icon={<IconRefresh/>} type="primary" theme="solid" onClick={() => {
                            setQueryParams({});
                            setUsernameInput('');
                            setEmailInput('');
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
                    modalType === 'create' ? '新增用户' : '编辑用户信息'
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
                        field='username'
                        label='用户名'
                        rules={[{required: true, message: '请输入用户名'}]}
                    />
                    <Form.Input
                        field='email'
                        label='邮箱'
                    />
                </Form>
            </Modal>
            <ChangePasswordModal ref={changePasswordRef}/>
        </div>
    );
};

export default UserPage;
