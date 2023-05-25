import { ReactNode, SetStateAction, Suspense, useEffect, useState } from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './routes/login'
import { createRoot } from 'react-dom/client'
import { PageLayoutModule } from './components/PageLayout'
import routes from './routes'
import moment from 'moment'
import zhCN from 'antd/es/locale/zh_CN';
import './index.css'
import { getUser } from './services';
import { setItem } from './utils/Storage';
import { PowerEnum } from './constants';
import { Client } from './utils';
import NotFound from './components/NotFound';
moment.locale('zh-cn')

const App = () => {

  const [routeList, setRouteList] = useState<React.ReactNode[]>([])
  const [geting, setGeting] = useState<boolean>(true)
  const [roleId, setRoleId] = useState<number>(0)

  useEffect(() => {
    getUser()
      .then((data: any) => {
        // 将userInfo放入浏览器缓存
        setItem(Client.USER_INFO, JSON.stringify(data));
        const roleId = data.roleId;
        setRoleId(roleId)
        const _rl: SetStateAction<ReactNode[]> | JSX.Element[] = [];
        if (roleId === PowerEnum.admin) { // admin权限返回所有路由
          routes.map((item, index) => {
            if (item.children?.length > 0) {
              item.children.map((inItem, inIndex) => {
                _rl.push((
                  <Route
                    key={`${inItem.name}-${inIndex}`}
                    path={inItem.path}
                    element={<inItem.element />}
                  />
                ));
              })
            } else {
              _rl.push((
                <Route
                  key={`${item.name}-${index}`}
                  path={item.path}
                  element={<item.element />}
                />
              ));
            }
          });
          setGeting(false)
        } else if (roleId != PowerEnum.admin) {
          routes.map((item, index) => {
            if (item.children?.length > 0 && item.power?.includes(roleId)) {
              item.children.map((inItem, inIndex) => {
                if (inItem.power?.includes(roleId)) {
                  _rl.push((
                    <Route
                      key={`${inItem.name}-${inIndex}`}
                      path={inItem.path}
                      element={<inItem.element />}
                    />
                  ));
                }
              })
            } else if (item.power?.includes(roleId)) {
              _rl.push((
                <Route
                  key={`${item.name}-${index}`}
                  path={item.path}
                  element={<item.element />}
                />
              ));
            }
          })
          setGeting(false)
        }
        setRouteList(_rl)
      }).catch()
  }, [])

  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={(
            <PageLayoutModule routes={routes} roleId={roleId} />
          )}>
            {routeList}
          </Route>
          <Route path="/login" element={<LoginPage />} />{
            !geting && (
              <Route path="*" element={<NotFound />} />
            )
          }
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

const container = document.getElementById('root')!;
const root = createRoot(container);

// 将原来的 createRoot 调用改为 root.render
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);

// 更新 root 对象
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);

export default App
