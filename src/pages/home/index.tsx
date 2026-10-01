import {Button, Typography} from '@douyinfe/semi-ui';
import {IconArrowRight, IconFile, IconHome, IconUser} from '@douyinfe/semi-icons';
import {useNavigate} from 'react-router-dom';
import {getUsername} from '@/src/utils/auth';
import PageHeader from '@/src/components/PageHeader';

const Home = () => {
    const navigate = useNavigate();
    const username = getUsername() || '用户';

    return (
        <div className="mx-auto min-h-full w-full max-w-[1560px] px-3 pb-6 pt-4 sm:px-5 lg:px-7 lg:pb-8 lg:pt-6">
            <PageHeader title="首页" description="查看后台概览并快速进入常用模块" icon={<IconHome/>}/>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                <div className="rounded-lg border border-(--semi-color-border) bg-(--semi-color-bg-0) p-6 shadow-sm">
                    <Typography.Text type="tertiary" className="text-[13px]!">欢迎回来</Typography.Text>
                    <Typography.Title heading={2} className="mb-2! mt-2! text-2xl! leading-8! tracking-normal!">
                        {username}
                    </Typography.Title>
                    <Typography.Text type="tertiary" className="block max-w-2xl leading-6">
                        从左侧导航选择一个模块开始工作。当前界面针对桌面宽度优化，内容区域会保持稳定的阅读和操作密度。
                    </Typography.Text>
                </div>

                <div className="rounded-lg border border-(--semi-color-border) bg-(--semi-color-bg-0) p-6 shadow-sm">
                    <Typography.Title heading={5} className="m-0! text-base!">快捷入口</Typography.Title>
                    <div className="mt-4 flex flex-col gap-2">
                        <Button
                            block
                            theme="light"
                            type="primary"
                            icon={<IconFile/>}
                            className="justify-between!"
                            onClick={() => navigate('/book')}
                        >
                            <span className="flex w-full items-center justify-between gap-3">图书管理 <IconArrowRight/></span>
                        </Button>
                        <Button
                            block
                            theme="light"
                            type="primary"
                            icon={<IconUser/>}
                            className="justify-between!"
                            onClick={() => navigate('/user/list')}
                        >
                            <span className="flex w-full items-center justify-between gap-3">用户管理 <IconArrowRight/></span>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
