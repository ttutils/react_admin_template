import { FaRegCopyright } from "react-icons/fa";
import React from "react";
import { Layout } from "@douyinfe/semi-ui";

export default function Index() {
    return (
        <Layout.Footer className='flex items-center justify-center w-full gap-2'>
            <p className="mb-1 flex items-center justify-center">
                <FaRegCopyright className="mr-1 text-sm"/>
                2024 - {new Date().getFullYear()}
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