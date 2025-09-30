import React from 'react';
import { Button, Form, Typography } from '@douyinfe/semi-ui-19';
import { IconKey, IconUser } from '@douyinfe/semi-icons';
import { APP_LOGIN_REDIRECT_URI, APP_NAME } from "@/src/config";
import { UserService } from "@/src/services/user";
import { useNavigate } from "react-router-dom";
import { demoStatusStore } from "@/src/stores/useDemoStatusStore";

const {Text} = Typography;

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(false);
    const isDemo: boolean = demoStatusStore.getState().is_demo
    let username = '';
    let password = '';
    let remember_me = false;

    if (isDemo || process.env.NODE_ENV !== 'production') {
        username = 'admin';
        password = 'admin123456';
        remember_me = true;
    }

    // 使用Form组件管理表单状态
    const handleSubmit = async (values: any) => {
        setLoading(true);
        await UserService.login(values);
        navigate(APP_LOGIN_REDIRECT_URI);
    };

    return (
        <div
            className='flex flex-col gap-8 p-8 rounded-lg w-[600px] h-[500px]'
            style={{
                border: '1px solid var(--semi-color-border)',
                backgroundColor: 'var(--semi-color-bg-1)', // 自动适配深色模式
            }}
        >
            <div className="flex flex-col items-center mb-6">
                <Text className="text-3xl font-bold text-[--semi-color-primary]">欢迎登录 {APP_NAME}</Text>
                <Text className="text-sm text-[--semi-color-text-2] mt-2">请输入您的账号和密码</Text>
            </div>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Form.Input
                    field="username"
                    label="账号"
                    prefix={<IconUser/>}
                    showClear
                    placeholder="请输入用户名"
                    initValue={username}
                    rules={[
                        {required: true, message: '账号不能为空'},
                        {
                            pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$|^[a-zA-Z0-9_]{4,20}$/,
                            message: '请输入有效用户名'
                        }
                    ]}
                />

                <Form.Input
                    field="password"
                    label="密码"
                    mode="password"
                    prefix={<IconKey/>}
                    showClear
                    placeholder="请输入密码"
                    initValue={password}
                    rules={[
                        {required: true, message: '密码不能为空'},
                        {min: 6, message: '密码至少6位字符'}
                    ]}
                />

                <div className="flex items-center justify-between">
                    <Form.Checkbox initValue={remember_me} field="remember_me" noLabel>记住我</Form.Checkbox>
                </div>

                {isDemo && <Text type="warning" size="small">默认账号密码为 admin/admin123456</Text>}

                <Button
                    htmlType="submit"
                    type="primary"
                    theme="solid"
                    loading={loading}
                    className="w-full h-10 rounded-lg"
                    style={{fontWeight: 600}}
                >
                    登录
                </Button>
            </Form>

        </div>
    );
};

export default Login;