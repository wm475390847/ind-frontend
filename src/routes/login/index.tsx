import { useNavigate } from "react-router-dom";
import styles from './index.module.less';
import backgroundImage from '/src/assets/img/background.jpeg';
import { Button, Divider, Form, Input, message } from 'antd';
import { Client } from "@/utils/client"
import { useState } from "react";

const LoginPage = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleCancel = () => {
    }

    const onSubmit = () => {
        form.validateFields().then(values => {
            setButtonLoading(true)
            new Client({})
                .login({ ...values, project: 'ar' })
                .then(res => {
                    message.success(res.message)
                    navigate('/')
                })
                .catch(err => {
                    message.error(err.message)
                })
                .finally(() => setButtonLoading(false))
        })
    }

    return (
        <div className={styles.loginPage} style={{ backgroundImage: `url(${backgroundImage})` }}>
            <Form className={styles.loginForm} form={form}>
                <h1 className={styles.loginTitle}>欢迎登录</h1>
                <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]} className={styles.loginInput}>
                    <Input placeholder="用户名" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} className={styles.loginInput}>
                    <Input.Password placeholder="密码" />
                </Form.Item>

                <Form.Item className={styles.loginBtn}>
                    <Button type="primary" htmlType="submit" block onClick={onSubmit} loading={buttonLoading}>
                        登录
                    </Button>
                </Form.Item>

                <Divider>或</Divider>

                <Form.Item>
                    <Button type="dashed" block>
                        注册
                    </Button>
                </Form.Item>
            </Form>
        </div>);
};

export default LoginPage;
