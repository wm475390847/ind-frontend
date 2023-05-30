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
import * as Icon from "@ant-design/icons";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import PopupModule from '../Popup';
import { getItem } from '@/utils/Storage';
import { PowerEnum } from '@/constants';

type PageLayoutModuleProp = {
  children?: ReactElement | ReactElement[];
  routes: RouteBase[];
  roleId: number
};

export const PageLayoutModule: React.FC<PageLayoutModuleProp> = ({ routes, roleId }) => {
  const { Sider, Content, Header } = Layout
  const [selectKey, setSelectKey] = useState(null)
  const [openKeys, setOpenKeys] = useState<any[]>([])
  const [avatar, setAvatar] = useState('wa')
  const [collapsed, setCollapsed] = useState(false)
  const [userInfo, setUserInfo] = useState<User>()
  const [type, setType] = useState<number>()
  const [menuItems, setMenuItem] = useState<any[]>([]);
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
   * @name 图标名称
   */
  const handleIconToElement = (name: string) =>
    React.createElement(Icon && (Icon as any)[name], {
      style: { fontSize: '15px' }
    })

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

  const handleMenuItems = () => {
    // 处理普通菜单项
    const getMenuItem = (item: RouteBase) => ({
      label: (<Link to={item.path}>{item.name}</Link>),
      key: item.path.split('/')[2],
      icon: handleIconToElement(item.icon),
      className: styles.menuItem,
    });

    // 处理子菜单项
    const getMenuChildren = (item: RouteBase) =>
      item.children
        ?.filter((i: RouteBase) => !i.hideInMenu)
        .map((inItem) => ({
          ...getMenuItem(inItem),
          key: String(inItem.path), // 使用子菜单项的 id 属性作为 key，并转换为字符串类型
        }));

    // 处理一级菜单项
    const getFirstMenuItem = (item: RouteBase) => ({
      label: item.name,
      key: item.path.split('/')[2],
      icon: handleIconToElement(item.icon),
      className: styles.menuFirstItem,
      children: getMenuChildren(item),
    });

    // 根据用户角色不同，生成符合权限的菜单项列表
    let menuList: any[];
    if (roleId === PowerEnum.admin) {
      menuList = (routes || [])
        .filter((i: RouteBase) => !i.hideInMenu)
        .map((item) =>
          item.children?.length > 0 ? getFirstMenuItem(item) : getMenuItem(item)
        );
    } else {
      menuList = (routes || [])
        .filter((i: RouteBase) => !i.hideInMenu && i.power?.includes(roleId))
        .map((item) =>
          item.children?.length > 0 ? getFirstMenuItem(item) : getMenuItem(item)
        );
    }
    // 将生成的菜单项列表保存在组件状态中
    setMenuItem(menuList);
  };

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
    handleMenuItems()
  }, []);

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
      <PopupModule type={type} user={userInfo} onCancel={() => setType(undefined)} setLoading={() => undefined} />
    </>
  );
};