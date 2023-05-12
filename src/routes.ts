import { PageTitle } from '@/constants';
import UserPage from './routes/user';


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
    name: PageTitle.user,
    path: '/app/user',
    element: UserPage,
    icon: "UserOutlined",
    children: [],
  }
];
export default routes;
