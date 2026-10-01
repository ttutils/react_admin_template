import React, {useRef, useState} from 'react';
import {Button, Form, Input, Modal, Select, Table, Tag} from '@douyinfe/semi-ui';
import type {ColumnProps} from '@douyinfe/semi-ui/lib/es/table';
import type {FormApi} from '@douyinfe/semi-ui/lib/es/form';
import {
    IconDelete,
    IconEdit,
    IconPlus,
    IconRefresh,
    IconSearch,
    IconUser,
} from '@douyinfe/semi-icons';
import useService from '@/src/hooks/useService';
import {UserService} from '@/src/services/user';
import type {AddUserParams, ChangePasswdParams, UpdateUserParams, UserInfo} from '@/src/api/user/types';
import {getUserid} from '@/src/utils/auth';
import PageHeader from '@/src/components/PageHeader';
import DataTablePanel from '@/src/components/DataTablePanel';

const UserPage = () => {
    const [pageSize, setPageSize] = useState(20);
    const [pageNum, setPage] = useState(1);
    const [queryParams, setQueryParams] = useState<{username?: string; enable?: boolean}>({});
    const [usernameInput, setUsernameInput] = useState('');
    const [enableInput, setEnableInput] = useState<boolean | undefined>();
    const serviceResponse = useService(() => UserService.list({
        page: pageNum,
        page_size: pageSize,
        ...queryParams,
    }), [pageNum, pageSize, queryParams]);
    const {data, loading} = serviceResponse[0];
    const refresh = serviceResponse[1];
    const [visible, setVisible] = useState(false);
    const [modalType, setModalType] = useState<'create' | 'edit'>('create');
    const [modalRecord, setModalRecord] = useState<UserInfo>();
    const [okLoading, setOkLoading] = useState(false);
    const formApi = useRef<FormApi>(null);
    const isAdmin = getUserid() === '1';
    const total = typeof data?.total === 'number' ? data.total : 0;

    const handleSearch = () => {
        setQueryParams({username: usernameInput || undefined, enable: enableInput});
        setPage(1);
    };

    const handleReset = () => {
        setQueryParams({});
        setUsernameInput('');
        setEnableInput(undefined);
        setPage(1);
    };

    const handleDelete = (record: UserInfo) => {
        Modal.confirm({
            title: '删除用户',
            content: `确定要删除用户“${record.username}”吗？此操作不可撤销。`,
            okButtonProps: {type: 'danger'},
            onOk: async () => {
                const success = await UserService.delete({user_id: String(record.user_id)});
                if (success) refresh();
            },
        });
    };

    const handleSubmit = async () => {
        if (!formApi.current) return;
        const targetRecord = modalRecord;
        if (modalType === 'edit' && !targetRecord) return;
        const values = await formApi.current.validate();
        setOkLoading(true);
        try {
            let success: boolean;
            if (modalType === 'create') {
                success = await UserService.add(values as AddUserParams);
            } else {
                if (!targetRecord) return;
                const {password, ...userValues} = values as UpdateUserParams & {password?: string};
                success = await UserService.update(targetRecord.user_id, userValues);
                if (success && password) {
                    success = await UserService.updatePassword(targetRecord.user_id, {password} as ChangePasswdParams);
                }
            }
            if (success) {
                refresh();
                setVisible(false);
            }
        } finally {
            setOkLoading(false);
        }
    };

    const columns: ColumnProps<UserInfo>[] = [
        {title: 'ID', width: 120, dataIndex: 'user_id'},
        {title: '用户名', dataIndex: 'username'},
        {
            title: '状态',
            dataIndex: 'enable',
            width: 140,
            render: (enabled: boolean) => (
                <Tag color={enabled ? 'green' : 'grey'}>{enabled ? '已启用' : '已停用'}</Tag>
            ),
        },
        {
            title: '操作',
            dataIndex: 'actions',
            align: 'right',
            width: 180,
            render: (_text: string, record: UserInfo) => (
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                    <Button
                        icon={<IconEdit/>}
                        type="primary"
                        theme="borderless"
                        size="small"
                        disabled={!isAdmin}
                        title={!isAdmin ? '仅管理员可编辑用户' : '编辑用户'}
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
                        disabled={!isAdmin || String(record.user_id) === '1'}
                        title={!isAdmin ? '仅管理员可删除用户' : String(record.user_id) === '1' ? '系统管理员不可删除' : '删除用户'}
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
                title="用户管理"
                icon={<IconUser/>}
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
                        disabled={!isAdmin}
                        title={!isAdmin ? '仅管理员可新增用户' : '新增用户'}
                    >
                        新增用户
                    </Button>
                )}
            />

            <div className="mb-3 flex w-full flex-col gap-2 rounded-lg border border-(--semi-color-border) bg-(--semi-color-bg-0) p-2.5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center lg:flex-1 lg:flex-nowrap">
                    <Input
                        className="w-full! sm:w-60!"
                        value={usernameInput}
                        onChange={setUsernameInput}
                        onEnterPress={handleSearch}
                        prefix={<IconSearch/>}
                        placeholder="搜索用户名"
                        showClear
                    />
                    <Select
                        className="w-full! sm:w-44!"
                        value={enableInput === undefined ? undefined : String(enableInput)}
                        onChange={value => setEnableInput(value === 'true' ? true : value === 'false' ? false : undefined)}
                        placeholder="全部状态"
                        showClear
                    >
                        <Select.Option value="true">已启用</Select.Option>
                        <Select.Option value="false">已停用</Select.Option>
                    </Select>
                    <Button icon={<IconSearch/>} type="primary" theme="solid" onClick={handleSearch}>查询</Button>
                    <Button icon={<IconRefresh/>} type="tertiary" theme="light" onClick={handleReset}>重置</Button>
                </div>
                <div className="flex w-full items-center justify-end lg:w-auto">
                    <span className="whitespace-nowrap text-[13px] text-(--semi-color-text-2)">共 {total} 个用户</span>
                </div>
            </div>

            <DataTablePanel>
                <Table
                    loading={loading}
                    columns={columns}
                    dataSource={data?.data || []}
                    rowKey="user_id"
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
                    scroll={{x: 720}}
                />
            </DataTablePanel>

            <Modal
                className="[&_.semi-modal]:mx-3! [&_.semi-modal]:max-w-[calc(100vw-1.5rem)]! sm:[&_.semi-modal]:mx-auto! sm:[&_.semi-modal]:max-w-[520px]! [&_.semi-modal-content]:rounded-lg! [&_.semi-modal-header]:border-b! [&_.semi-modal-header]:border-(--semi-color-border)! [&_.semi-modal-header]:pb-3.5! [&_.semi-modal-footer]:flex! [&_.semi-modal-footer]:items-center! [&_.semi-modal-footer]:justify-end! [&_.semi-modal-footer]:gap-2! [&_.semi-modal-footer]:border-t! [&_.semi-modal-footer]:border-(--semi-color-border)! [&_.semi-modal-footer]:pt-3.5! [&_.semi-modal-footer_.semi-button]:m-0!"
                title={modalType === 'create' ? '新增用户' : '编辑用户'}
                width={520}
                visible={visible}
                onCancel={() => {
                    if (!okLoading) setVisible(false);
                }}
                onOk={handleSubmit}
                okButtonProps={{loading: okLoading}}
                maskClosable={false}
            >
                <Form
                    key={`${modalType}-${modalRecord?.user_id || 'new'}`}
                    layout="vertical"
                    initValues={modalRecord}
                    getFormApi={api => formApi.current = api as FormApi}
                >
                    <Form.Input field="username" label="用户名" rules={[{required: true, message: '请输入用户名'}]} showClear/>
                    <Form.Input
                        field="password"
                        label={modalType === 'create' ? '密码' : '新密码'}
                        mode="password"
                        placeholder={modalType === 'create' ? '至少 6 位字符' : '留空则不修改密码'}
                        rules={[
                            ...(modalType === 'create' ? [{required: true, message: '请输入密码'}] : []),
                            {min: 6, message: '密码至少 6 位字符'},
                        ]}
                        showClear
                    />
                    {modalType === 'edit' && String(modalRecord?.user_id) !== '1' ? <Form.Switch field="enable" label="启用账户"/> : null}
                </Form>
            </Modal>
        </div>
    );
};

export default UserPage;
