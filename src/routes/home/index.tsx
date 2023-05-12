import { Button, Form, Input } from 'antd';
import styles from './index.module.less';

const HomePage: React.FC = () => {
    return (
        <div className={styles.loginPage}>
            <Form className={styles.loginForm} >
                <h1 className={styles.loginTitle}>欢迎登录</h1>
                <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]} className={styles.loginInput}>
                    <Input placeholder="用户名" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} className={styles.loginInput}>
                    <Input.Password placeholder="密码" />
                </Form.Item>

                <Form.Item className={styles.loginBtn}>
                    <Button type="primary" htmlType="submit" block>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>);
}

export default HomePage