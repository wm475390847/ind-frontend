import { PageTitle } from '@/constants';
import UserPage from './routes/user';
import ConfigPage from './routes/config';
import { getItem } from './utils/Storage';
import { Client } from './utils';
import DataBoard from './routes/board';

export interface RouteBase {
  name: string;
  path: string;
  element?: any;
  icon: string;
  children: RouteBase[];
  /** 在左侧菜单中进行隐藏 */
  hideInMenu?: boolean;
}

const userType = getItem(Client.USER_TYPE) === '0' ? false : true

const routes: RouteBase[] = [
  {
    name: PageTitle.board,
    path: '/app/board',
    element: DataBoard,
    icon: "AlertOutlined",
    children: [],
  },
  {
    name: PageTitle.user,
    path: '/app/user',
    element: UserPage,
    icon: "UserOutlined",
    children: [],
    hideInMenu: userType
  },
  {
    name: PageTitle.config,
    path: '/app/config',
    element: ConfigPage,
    icon: "SettingOutlined",
    children: [],
    hideInMenu: userType
  }
];
export default routes;
