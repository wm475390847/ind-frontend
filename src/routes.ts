import { PageTitle, PowerEnum } from '@/constants';
import UserPage from './routes/user';
import ConfigPage from './routes/config';
import DataBoard from './routes/board';

export interface RouteBase {
  hideInMenu?: boolean;
  name: string;
  path: string;
  element?: any;
  icon: string;
  children: RouteBase[];
  power: PowerEnum[];
}

const routes: RouteBase[] = [
  {
    name: PageTitle.board,
    path: '/app/board',
    element: DataBoard,
    icon: "AlertOutlined",
    children: [],
    power: [PowerEnum.common]
  },
  {
    name: PageTitle.user,
    path: '/app/user',
    element: UserPage,
    icon: "UserOutlined",
    children: [],
    power: [PowerEnum.admin]
  },
  {
    name: PageTitle.config,
    path: '/app/config',
    element: ConfigPage,
    icon: "SettingOutlined",
    children: [],
    power: [PowerEnum.admin]
  }
];
export default routes;
