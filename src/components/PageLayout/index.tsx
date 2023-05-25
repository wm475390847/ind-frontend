import React, { ReactElement, useEffect, useState } from 'react';
import { Button, Layout, Menu, Popover, message, theme, } from 'antd';
import classnames from 'classnames';
import { Link, Outlet } from 'react-router-dom';
import { RouteBase } from '../../routes';
import styles from './index.module.less';
import logo from '@/assets/svg/logo.svg';
import logoutIcon from '@/assets/svg/logout.svg';
import modify from '@/assets/svg/modify.svg';
import person from '@/assets/svg/person.svg';
import { Client } from '@/utils';
import { Footer } from 'antd/es/layout/layout';
import { getUser } from '@/services';
import * as Icon from "@ant-design/icons";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import AccountModule from '../Account';
import { getItem, setItem } from '@/utils/Storage';

type PageLayoutModuleProp = {
  children?: ReactElement | ReactElement[];
  routes: RouteBase[];
};

export const PageLayoutModule: React.FC<PageLayoutModuleProp> = ({ routes }) => {
  const { Sider, Content, Header } = Layout
  const [selectKey, setSelectKey] = useState(null)
  const [openKeys, setOpenKeys] = useState<any[]>([])
  const [avatar, setAvatar] = useState('wa')
  const [collapsed, setCollapsed] = useState(false)
  const [userInfo, setUserInfo] = useState<User>()
  const [type, setType] = useState<number>()
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleMenuChange = (_menuItem: any) => {
    setSelectKey(_menuItem.key);
  }

  const handleOpenChange = (_keys: string[]) => {
    setOpenKeys(_keys);
  }

  /**
   * 退出登录
   */
  const handleLogout = () => {
    new Client({})
      .logout()
      .then(res => {
        message.success(res.message)
      })
      .catch(err => {
        message.error(err.message)
      })
  }

  /**
   * 创建icon图标元素
   */
  const handleIconToElement = (name: string) =>
    React.createElement(Icon && (Icon as any)[name], {
      style: { fontSize: '15px' }
    })

  useEffect(() => {
    const info = getItem(Client.USER_INFO)
    const userInfo = JSON.parse(info)
    setUserInfo(userInfo)
    setAvatar('')
    const _pathArr: any = location.pathname.split('/');
    if (_pathArr.length === 3) {
      setSelectKey(_pathArr[2]);
    } else {
      setSelectKey(_pathArr[3]);
      setOpenKeys([_pathArr[2]]);
    }
  }, []);

  /**
   * 点开头像弹窗之后的内容
   */
  const popoverContent = (
    <div className={styles.popoverWrapper} >
      <div className={classnames(styles.popLine)}>
        <img src={person} className={styles.icon} alt="" />
        <div className={styles.menuText} onClick={() => setType(4)}>个人信息</div>
      </div>

      <div className={classnames(styles.popLine)} >
        <img src={modify} className={styles.icon} alt="" />
        <div className={styles.menuText} onClick={() => setType(5)}>修改密码</div>
      </div>

      <div className={styles.popLine} >
        <img src={logoutIcon} className={styles.icon} alt="" />
        <div className={styles.menuText} onClick={handleLogout}>退出登录</div>
      </div>
    </div>
  )

  /**
   * 获取目录集合
   */
  const menuItems = (routes || []).filter((i: RouteBase) => !i.hideInMenu).map(item => {
    if (item.children?.length > 0) {
      const menuItem = {
        label: item.name,
        key: item.path.split('/')[2],
        icon: handleIconToElement(item.icon),
        className: styles.menuFirstItem,
        children: item.children.filter((i: RouteBase) => !i.hideInMenu).map(inItem => ({
          label: (<Link to={inItem.path}>{inItem.name}</Link>),
          key: inItem.path.split('/')[3],
          icon: handleIconToElement(item.icon),
          className: styles.menuItem,
        }))
      }
      return menuItem;
    } else {
      return {
        label: (<Link to={item.path}>{item.name}</Link>),
        key: item.path.split('/')[2],
        icon: handleIconToElement(item.icon),
        className: styles.menuItem,
      }
    }
  });

  return (
    <>
      <Layout className={styles.layout}>
        <Sider collapsed={collapsed}>
          <div className={styles.logo}>
            <img src={logo} alt="" />
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={[menuItems[0].key]}
            selectedKeys={[selectKey] as unknown as string[]}
            openKeys={openKeys}
            items={menuItems}
            onSelect={handleMenuChange}
            onOpenChange={handleOpenChange} />
        </Sider>

        <Layout>
          <Header className={styles.header}>
            <Button className={styles.button}
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)} />
            <Popover
              placement="bottomRight"
              content={popoverContent}
              trigger="hover"
            >
              <div className={styles.user}>
                {avatar ? (
                  <img src={avatar} alt="" />
                ) : userInfo?.username.split('')[0] || 's'}
              </div>
            </Popover>
          </Header>

          <Content style={{ margin: '24px 16px 0', height: '100%' }}>
            <div style={{ padding: 20, minHeight: 300, background: colorBgContainer, height: '100%', width: '100%' }}>
              <Outlet />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
        </Layout>
      </Layout>
      <AccountModule type={type} userInfo={userInfo} onCancel={() => setType(undefined)} setLoading={() => undefined} />
    </>
  );
};