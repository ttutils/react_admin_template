import { FaRegCopyright } from "react-icons/fa";
import React from "react";
import { Layout } from "@douyinfe/semi-ui";
import { APP_START_YEAR } from "@/src/config";

export default function Index() {
    const year = new Date().getFullYear();
    return (
        <Layout.Footer className='flex items-center justify-center w-full gap-2'>
            <p className="mb-1 flex items-center justify-center">
                <FaRegCopyright className="mr-1 text-sm"/>
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