import { Button, Form, Input, Modal, message } from "antd"
import moment from "moment"
import React, { useEffect, useState } from "react"
import styles from './index.module.less'

type AuthModuleProps = {
    type?: number
    userInfo?: UserInfo
    onCancel?: () => void
}

/**
 * 账号修改组件
 * @param props 参数
 * @returns 
 */
export const AuthModule: React.FC<AuthModuleProps> = (props) => {
    const [form] = Form.useForm()
    const { type, userInfo, onCancel } = (props)
    const [open, setOpen] = useState(false)

    const handleCancel = () => {
        setOpen(false)
        onCancel && onCancel()
    }

    const onSubmit = () => {
        form.validateFields()
            .then(values => {
                if (values.password1 != values.password2) {
                    message.error("新密码两次填写不一致")
                    return
                }
            })
    }

    useEffect(() => {
        type && setOpen(true)
    }, [type])

    return (
        <>
            < Modal
                open={open}
                title={`${type === 1 ? '个人信息' : '重置密码'}`}
                onCancel={handleCancel}
                footer={type === 2 && < Button type='primary' onClick={onSubmit} > 确定</Button >}
                destroyOnClose
                width={500}
            >
                <Form
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 16, offset: 1 }}
                    form={form}
                    preserve={false}
                    className={styles.form}
                >
                    {type === 1 && userInfo &&
                        <div>
                            <Form.Item label="姓名" >{userInfo?.username}</Form.Item>
                            <Form.Item label="手机" >{userInfo?.phone}</Form.Item>
                            <Form.Item label="部门" >{userInfo?.department}</Form.Item>
                            <Form.Item label="创建时间" >{moment(userInfo?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
                        </div>
                    }

                    {type === 2 &&
                        <div>
                            <Form.Item name="password" label="原密码" rules={[{ required: true, message: '原密码不能为空' }]}>
                                <Input.Password placeholder="请输入原密码" />
                            </Form.Item>
                            < Form.Item name="password1" label="新密码" rules={[{ required: true, message: '新密码不能为空' }]}>
                                <Input.Password placeholder="请输入新密码" />
                            </Form.Item>
                            <Form.Item name="password2" label="确认新密码" rules={[{ required: true, message: '新密码不能为空' }]}>
                                <Input.Password placeholder="请再次输入新密码" />
                            </Form.Item>
                        </div>
                    }
                </Form>
            </Modal >
        </>
    );
}
export default AuthModule