import { Suspense } from 'react'
import { ConfigProvider } from 'antd';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from './routes/login'
import { createRoot } from 'react-dom/client'
import { PageLayoutModule } from './components/PageLayout'
import routes from './routes'
import moment from 'moment'
import zhCN from 'antd/es/locale/zh_CN';
import './index.css'
moment.locale('zh-cn')

const routeList: any[] = [];
routes.map((item, index) => {
  if (item.children?.length > 0) {
    item.children.map((inItem, inIndex) => {
      routeList.push((
        <Route
          key={`${inItem.name}-${inIndex}`}
          path={inItem.path}
          element={<inItem.element />}
        ></Route>
      ))
    })
  } else {
    routeList.push((
      <Route
        key={`${item.name}-${index}`}
        path={item.path}
        element={< item.element />}
      ></Route >
    ));
  }
})
const App = () => {
  return (
    <Suspense fallback={<div />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={(
            <PageLayoutModule routes={routes} />
          )}>
            {routeList}
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<div>NotFound</div>} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);

export default App
