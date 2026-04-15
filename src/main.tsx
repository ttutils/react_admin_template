import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SimpleApiService } from "@/src/services/simple_api";
import { demoStatusStore } from "@/src/stores/useDemoStatusStore";
import { serverInfoStore } from "@/src/stores/useServerInfoStore";

// 异步获取demo状态并设置到store中
SimpleApiService.get_demo().then(is_demo => {
    demoStatusStore.getState().setDemoStatus(is_demo);
});

SimpleApiService.get_server_info().then((resp) => {
    serverInfoStore.getState().setServerInfo(resp.data?.version || "1.0.0");
})

const root = document.getElementById('root');
ReactDOM.createRoot(root as HTMLElement).render(<App/>)
