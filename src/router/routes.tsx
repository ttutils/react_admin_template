import React, { ReactElement } from 'react';
import { RouteObject } from 'react-router-dom';
import Wrapper from './wrapper';
import { IconAlertTriangle, IconFile, IconHome, IconUser } from '@douyinfe/semi-icons';

import Layout from '@/src/pages/layout';
import LayoutWithTopNav from '@/src/pages/layout/layoutWithTopNav';

import Login from '@/src/pages/login';
import UserList from '@/src/pages/user';

import Book from '@/src/pages/book';
import Home from '@/src/pages/home';

import NotFond from '@/src/pages/exception/404';
import NoAuth from '@/src/pages/exception/403';

export interface IRouters {
  text: string;
  icon?: ReactElement;
  items?: IRouters[];
  itemKey: string;
}

// 路由默认打开
export const defaultOpenKeys = ['/exception'];

// 左侧导航路由
export const MenuRoutes: IRouters[] = [
  {
    itemKey: '/home',
    icon: <IconHome />,
    text: '首页',
  },
  {
    itemKey: '/book',
    icon: <IconFile />,
    text: '图书管理',
  },
  {
    itemKey: '/user/list',
    icon: <IconUser />,
    text: '用户管理',
  },
  {
    itemKey: '/exception',
    icon: <IconAlertTriangle />,
    text: '异常页',
    items: [
      {
        itemKey: '/exception/404',
        text: '404'
      },
      {
        itemKey: '/exception/403',
        text: '403'
      }
    ]
  },
];

// 浏览器路由
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Wrapper component={<Layout />} auth />,
    // 导航内的路由写在这里，同时要添加到Menu中
    children: [
      {
        path: 'home',
        element: <Wrapper component={<Home />} />
      },
      {
        path: 'book',
        element: <Wrapper component={<Book />} />
      },
      {
        path: 'user/list',
        element: <Wrapper component={<UserList />} />
      },
    ]
  },
  // 有顶部导航，没有侧边导航写这里
  {
    path: '/user',
    element: <LayoutWithTopNav />,
    children: [
      {
        path: 'login',
        element: <Wrapper component={<Login />} />
      },
    ]
  },
  // 异常页路由
  {
    path: '/exception',
    element: <LayoutWithTopNav />,
    children: [
      {
        path: '404',
        element: <Wrapper component={<NotFond />} />
      },
      {
        path: '403',
        element: <Wrapper component={<NoAuth />} />
      },
    ]
  },
  // 兜底页面，需要放在最下方
  {
    path: '*',
    element: (
      <div className='flex flex-col items-center justify-center w-screen h-screen'>
        <NotFond />
      </div>
    )
  }
]
