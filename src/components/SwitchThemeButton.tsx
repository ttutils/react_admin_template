import { IconMoon } from "@douyinfe/semi-icons";
import { Button, Tooltip } from "@douyinfe/semi-ui";
import { useState } from "react";

export default function SwitchThemeButton() {
    const [isDark, setIsDark] = useState<boolean>(false);

    const changeMode = () => {
        setIsDark(!isDark);
        const body = document.body;
        if (body.hasAttribute("theme-mode")) {
            body.removeAttribute("theme-mode");
        } else {
            body.setAttribute("theme-mode", "dark");
        }
    };

    const IconButtons = [
        {
            icon: <IconMoon size="extra-large"/>,
            event: () => changeMode(),
            tip: `切换到${isDark ? "亮色" : "暗色"}模式`,
        },
    ];

    // 顶部导航右侧icon按钮
    const renderIcons = () => {
        return (
            <div className="flex gap-2 mr-4">
                {IconButtons.map((item, index) => {
                    return item?.tip ? (
                        <Tooltip content={item?.tip} key={index}>
                            <Button
                                theme="borderless"
                                icon={item.icon}
                                onClick={item.event}
                                type="tertiary"
                            />
                        </Tooltip>
                    ) : (
                        <Button
                            key={index}
                            theme="borderless"
                            icon={item.icon}
                            onClick={item.event}
                            type="tertiary"
                        />
                    );
                })}
            </div>
        );
    };

    return renderIcons();
}