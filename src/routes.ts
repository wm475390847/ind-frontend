import { PageTitle } from '@/constants';
import UserPage from './routes/user';
import ConfigPage from './routes/config';

export interface RouteBase {
  name: string;
  path: string;
  element?: any;
  icon: string;
  children: RouteBase[];
  /** 在左侧菜单中进行隐藏 */
  hideInMenu?: boolean;
}

const routes: RouteBase[] = [
  {
    name: PageTitle.forecast,
    path: '/app/forecast',
    element: UserPage,
    icon: "AlertOutlined",
    children: [],
  },
  {
    name: PageTitle.user,
    path: '/app/user',
    element: UserPage,
    icon: "UserOutlined",
    children: [],
  },
  {
    name: PageTitle.config,
    path: '/app/config',
    element: ConfigPage,
    icon: "SettingOutlined",
    children: [],
  }
];
export default routes;
