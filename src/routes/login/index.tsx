import { useNavigate } from "react-router-dom";
import { Button, Form, Input, message } from 'antd';
import { Client } from "@/utils/client"
import React, { useState } from "react";
import styles from './index.module.less';

const LoginPage: React.FC = () => {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleCancel = () => {
    }

    const onSubmit = () => {
        form.validateFields().then(values => {
            setButtonLoading(true)
            new Client({})
                .login({ ...values, project: 'ind' })
                .then(res => {
                    message.success(res.message)
                    navigate('/app/user')
                })
                .catch(err => {
                    message.error(err.message)
                })
                .finally(() => setButtonLoading(false))
        })
    }

    return (
        <div className={styles.loginPage}>
            <Form className={styles.loginForm} form={form}>
                <h1 className={styles.loginTitle}>欢迎登录</h1>
                <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]} >
                    <Input className={styles.loginInput} placeholder="用户名" />
                </Form.Item>

                <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]} >
                    <Input.Password className={styles.loginInput} placeholder="密码" />
                </Form.Item>

                <Form.Item >
                    <Button className={styles.loginButton} type="primary" onClick={onSubmit} loading={buttonLoading}>
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </div>);
};

export default LoginPage;
