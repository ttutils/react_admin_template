import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { SimpleApiService } from "@/src/services/simple_api";
import { demoStatusStore } from "@/src/stores/useDemoStatusStore";

// 异步获取demo状态并设置到store中
SimpleApiService.get_demo().then(is_demo => {
    demoStatusStore.getState().setDemoStatus(is_demo);
});

const root = document.getElementById('root');
ReactDOM.createRoot(root as HTMLElement).render(<App />)
