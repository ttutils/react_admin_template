import {IconMonitorStroked, IconMoon, IconSun} from '@douyinfe/semi-icons';
import {Button, Dropdown} from '@douyinfe/semi-ui';
import {useState, type ReactNode} from 'react';
import {useThemeMode, type ThemeMode} from '@/src/hooks/useThemeMode';

const THEME_OPTIONS: Array<{mode: ThemeMode; label: string; icon: ReactNode}> = [
    {mode: 'light', label: '亮色', icon: <IconSun/>},
    {mode: 'dark', label: '暗色', icon: <IconMoon/>},
    {mode: 'system', label: '跟随系统', icon: <IconMonitorStroked/>},
];

export default function SwitchThemeButton() {
    const {themeMode, resolvedTheme, setThemeMode} = useThemeMode();
    const [visible, setVisible] = useState(false);
    const currentOption = THEME_OPTIONS.find(option => option.mode === themeMode) ?? THEME_OPTIONS[2];
    const resolvedLabel = resolvedTheme === 'dark' ? '暗色' : '亮色';

    return (
        <div className="shrink-0">
            <Dropdown
                trigger="click"
                position="bottomRight"
                visible={visible}
                onVisibleChange={setVisible}
                render={(
                    <Dropdown.Menu>
                        {THEME_OPTIONS.map(option => (
                            <Dropdown.Item
                                key={option.mode}
                                icon={option.icon}
                                selected={option.mode === themeMode}
                                showTick
                                onClick={() => {
                                    setThemeMode(option.mode);
                                    setVisible(false);
                                }}
                            >
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                )}
            >
                <Button
                    className="min-w-[34px]"
                    theme="borderless"
                    type="tertiary"
                    icon={currentOption.icon}
                    aria-label={`主题：${currentOption.label}，当前显示${resolvedLabel}`}
                >
                    <span className="ml-1 max-[480px]:hidden">{currentOption.label}</span>
                </Button>
            </Dropdown>
        </div>
    );
}
