import { FaRegCopyright } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { Layout } from "@douyinfe/semi-ui-19";
import { APP_START_YEAR } from "@/src/config";
import { ServerInfoService } from "@/src/services/server_info";

export default function Index() {
    const year = new Date().getFullYear();
    const [version, setVersion] = useState<string>('');

    useEffect(() => {
        const getServerInfo = async () => {
            const resp = await ServerInfoService.get();
            if (resp.data.version) {
                setVersion(resp.data.version);
            }
        }
        getServerInfo();
    }, [version]);
    return (
        <Layout.Footer className='flex items-center justify-center w-full gap-2'>
            <p className="mb-1 flex items-center justify-center">
                {version}
                <FaRegCopyright className="ml-1 mr-1 text-sm"/>
                {year === APP_START_YEAR ? APP_START_YEAR : ` - ${year}`}
                <a
                    href="https://github.com/buyfakett"
                    target="_blank"
                    className="text-blue-400 hover:underline ml-1">
                    buyfakett
                </a>
                . All rights reserved.
            </p>
        </Layout.Footer>
    );
}