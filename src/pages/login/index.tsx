import React, {useCallback, useEffect, useState} from 'react';
import {Button, Form, Spin, Typography} from '@douyinfe/semi-ui';
import {IconKey, IconRefresh, IconSemiLogo, IconUser} from '@douyinfe/semi-icons';
import {APP_LOGIN_REDIRECT_URI, APP_NAME} from '@/src/config';
import {UserService} from '@/src/services/user';
import {useNavigate} from 'react-router-dom';
import {demoStatusStore} from '@/src/stores/useDemoStatusStore';
import {authStore} from '@/src/stores/useAuthStore';
import {checkToken} from '@/src/utils/checkToken';

const {Text} = Typography;
const isDevelopment = import.meta.env.DEV;

interface LoginFormValues {
    username: string;
    password: string;
    captcha: string;
    remember_me?: boolean;
}

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [captchaLoading, setCaptchaLoading] = useState(false);
    const [captchaId, setCaptchaId] = useState('');
    const [captchaImage, setCaptchaImage] = useState('');
    const isDemo = demoStatusStore(state => state.is_demo);
    const [hasHydrated, setHasHydrated] = useState(authStore.persist.hasHydrated());
    const defaultCredentials = isDemo || isDevelopment;

    const generateCaptcha = useCallback(async () => {
        setCaptchaLoading(true);
        try {
            const captchaData = await UserService.getCaptcha();
            if (captchaData) {
                setCaptchaId(captchaData.id);
                setCaptchaImage(captchaData.base64_image);
            }
        } finally {
            setCaptchaLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = authStore.persist.onFinishHydration(() => setHasHydrated(true));
        if (authStore.persist.hasHydrated()) setHasHydrated(true);
        else void authStore.persist.rehydrate();
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!hasHydrated) return;
        if (checkToken()) {
            navigate(APP_LOGIN_REDIRECT_URI, {replace: true});
        } else {
            void generateCaptcha();
        }
    }, [generateCaptcha, hasHydrated, navigate]);

    const handleSubmit = async (values: LoginFormValues) => {
        setLoading(true);
        try {
            const success = await UserService.login({
                ...values,
                remember_me: values.remember_me !== false,
                captcha_id: captchaId,
            });
            if (success) navigate(APP_LOGIN_REDIRECT_URI, {replace: true});
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[440px] max-w-full rounded-lg border border-(--semi-color-border) bg-(--semi-color-bg-1) p-8 shadow-[0_18px_48px_rgba(24,32,47,0.1)] [body[theme-mode=dark]_&]:shadow-[0_18px_48px_rgba(0,0,0,0.28)]">
            <div className="mb-6 flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-(--semi-color-primary-light-default) text-(--semi-color-primary)">
                    <IconSemiLogo className="size-7!" aria-hidden="true"/>
                </div>
                <div className="min-w-0">
                    <Typography.Title heading={3} className="m-0! truncate text-[23px]! leading-[31px]! tracking-normal!">
                        {APP_NAME}
                    </Typography.Title>
                    <Text type="tertiary" className="mt-0.5 block">管理后台</Text>
                </div>
            </div>

            <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Form.Input
                    field="username"
                    label="账号"
                    prefix={<IconUser/>}
                    showClear
                    placeholder="请输入用户名"
                    initValue={defaultCredentials ? 'admin' : ''}
                    rules={[
                        {required: true, message: '账号不能为空'},
                        {
                            pattern: /^(?:[\w-]+@[\w-]+\.[\w-]{2,4}|[a-zA-Z0-9._-]{4,50})$/,
                            message: '请输入有效用户名',
                        },
                    ]}
                />
                <Form.Input
                    field="password"
                    label="密码"
                    mode="password"
                    prefix={<IconKey/>}
                    showClear
                    placeholder="请输入密码"
                    initValue={defaultCredentials ? 'admin123456' : ''}
                    rules={[
                        {required: true, message: '密码不能为空'},
                        {min: 6, message: '密码至少6位字符'},
                    ]}
                />

                <div className="grid grid-cols-[minmax(0,1fr)_132px] items-end gap-3">
                    <div className="min-w-0">
                        <Form.Input
                            field="captcha"
                            label="验证码"
                            initValue={isDevelopment ? 'a' : ''}
                            placeholder="请输入验证码"
                            rules={[{required: true, message: '验证码不能为空'}]}
                            showClear
                        />
                    </div>
                    <div className="flex items-end pb-3">
                        <Button
                            htmlType="button"
                            theme="borderless"
                            type="tertiary"
                            className="relative flex h-10! w-[132px]! items-center justify-center overflow-hidden rounded-md! border! border-(--semi-color-border)! bg-white! p-0.5! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--semi-color-primary)"
                            onClick={() => void generateCaptcha()}
                            disabled={captchaLoading}
                            aria-label="刷新验证码"
                            aria-busy={captchaLoading}
                            title="刷新验证码"
                        >
                            {captchaImage ? (
                                <img src={captchaImage} alt="验证码" className={`block h-[34px] w-full object-contain ${captchaLoading ? 'opacity-40' : ''}`}/>
                            ) : <IconRefresh aria-hidden="true"/>}
                            {captchaLoading ? <Spin size="small" className="absolute"/> : null}
                        </Button>
                    </div>
                </div>

                <Form.Checkbox initValue field="remember_me" noLabel>记住我</Form.Checkbox>
                {isDemo ? <Text type="warning" size="small">默认账号密码为 admin/admin123456</Text> : null}
                <Button htmlType="submit" type="primary" theme="solid" loading={loading} className="h-10! w-full! font-semibold!">
                    登录
                </Button>
            </Form>
        </div>
    );
};

export default Login;
