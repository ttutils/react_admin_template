import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Form, Modal} from '@douyinfe/semi-ui';
import type {FormApi} from '@douyinfe/semi-ui/lib/es/form';
import {IconKey} from '@douyinfe/semi-icons';
import {UserService} from '@/src/services/user';
import type {ChangePasswdParams} from '@/src/api/user/types';

export interface ChangePasswordModalRef { open: (userId: string) => void; }
interface ChangePasswordModalProps { onSuccess?: () => void; }

const ChangePasswordModal = forwardRef<ChangePasswordModalRef, ChangePasswordModalProps>(
    ({onSuccess}, ref) => {
        const [visible, setVisible] = useState(false);
        const [okLoading, setOkLoading] = useState(false);
        const userIdRef = useRef('');
        const formApi = useRef<FormApi>(null);

        useImperativeHandle(ref, () => ({
            open: (userId: string) => {
                userIdRef.current = userId;
                formApi.current?.reset();
                setVisible(true);
            },
        }));

        const handleSubmit = async () => {
            if (!formApi.current) return;
            const values = await formApi.current.validate();
            setOkLoading(true);
            try {
                const success = await UserService.updatePassword(userIdRef.current, values as ChangePasswdParams);
                if (success) {
                    setVisible(false);
                    onSuccess?.();
                }
            } finally {
                setOkLoading(false);
            }
        };

        return (
            <Modal
                className="[&_.semi-modal]:!w-[min(480px,calc(100vw-24px))] [&_.semi-modal]:!max-w-[calc(100vw-24px)] [&_.semi-modal-content]:rounded-lg! [&_.semi-modal-header]:border-b! [&_.semi-modal-header]:border-(--semi-color-border)! [&_.semi-modal-header]:pb-3.5! [&_.semi-modal-body]:max-h-[calc(100dvh-220px)] [&_.semi-modal-body]:overflow-y-auto! [&_.semi-modal-footer]:flex! [&_.semi-modal-footer]:items-center! [&_.semi-modal-footer]:justify-end! [&_.semi-modal-footer]:gap-2! [&_.semi-modal-footer]:border-t! [&_.semi-modal-footer]:border-(--semi-color-border)! [&_.semi-modal-footer]:pt-3.5! [&_.semi-modal-footer_.semi-button]:m-0!"
                title={<span className="flex items-center gap-2"><IconKey/>修改密码</span>}
                visible={visible}
                onCancel={() => {
                    if (!okLoading) setVisible(false);
                }}
                onOk={handleSubmit}
                okText="确认修改"
                okButtonProps={{loading: okLoading, icon: <IconKey/>}}
                maskClosable={false}
            >
                <Form layout="vertical" getFormApi={api => formApi.current = api}>
                    <Form.Input
                        field="password"
                        label="新密码"
                        mode="password"
                        prefix={<IconKey/>}
                        placeholder="请输入至少 6 位字符"
                        showClear
                        rules={[
                            {required: true, message: '密码不能为空'},
                            {min: 6, message: '密码至少6位字符'},
                        ]}
                    />
                </Form>
            </Modal>
        );
    },
);

ChangePasswordModal.displayName = 'ChangePasswordModal';
export default ChangePasswordModal;
