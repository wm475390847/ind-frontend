import { Button, Form, Input, Modal, Select, message } from "antd"
import React, { useEffect, useState } from "react";
import { UserTypeList } from "@/constants";
import styles from './index.module.less'
import { addUser, modifyUserInfo, resetPassword } from "@/services";

type UserModuleProps = {
    type?: number
    userInfo?: UserInfo
    onCancel?: () => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * 映射表
 * @param props 参数
 * @returns 
 */
export const UserModule: React.FC<UserModuleProps> = (props) => {
    const { type, userInfo, onCancel, setLoading } = (props)
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleCancel = () => {
        setOpen(false)
        onCancel && onCancel()
    }

    const patseType = (value: string) => {
        return value === '管理员' ? 0 : 1
    }

    const options = () => {
        return UserTypeList.map((item, index) => ({
            value: index,
            label: item
        }));
    };

    const onSubmit = () => {
        form.validateFields().then(values => {
            if (type === 3) {
                if (values.password1 != values.password2) {
                    message.error("新密码两次填写不一致")
                    return
                }
                userInfo &&
                    resetPassword({
                        id: userInfo.id,
                        password: values.password1
                    }).then(req => {
                        message.success(req.message)
                        handleCancel()
                    }).catch(err => message.error(err.message))
                        .finally(() => setButtonLoading(false))
            }
            if (type === 2) {
                setButtonLoading(true)
                modifyUserInfo({
                    ...values,
                    id: userInfo?.id,
                    type: patseType(values.type)
                }).then(res => {
                    message.success(res.message)
                    setLoading(true)
                    handleCancel()
                }).catch(err => message.error(err.message))
                    .finally(() => setButtonLoading(false))
            }
            if (type === 1) {
                if (values.password1 != values.password2) {
                    message.error("新密码两次填写不一致")
                    return
                }
                setButtonLoading(true)
                addUser({
                    project: "ind",
                    username: values.username,
                    department: values.department,
                    type: values.type,
                    phone: values.phone,
                    password: values.password1
                })
                    .then(res => {
                        message.success(res.message)
                        handleCancel()
                        setLoading(true)
                    }).catch(err => message.error(err.message))
                    .finally(() => setButtonLoading(false))
            }
        })
    }

    useEffect(() => {
        type && setOpen(true)
    }, [type])

    useEffect(() => {
        if (open && type === 2 && userInfo) {
            setTimeout(() => {
                form.setFieldsValue({
                    username: userInfo.username,
                    phone: userInfo.phone,
                    department: userInfo.department,
                    type: UserTypeList[userInfo.type],
                    password1: null,
                    password2: null
                })
            }, 500);
        }
    }, [open])

    return (
        <Modal
            open={open}
            title={`${type === 2 ? '编辑用户' : type === 3 ? '重置密码' : '新增用户'}`}
            footer={<Button loading={buttonLoading} type='primary' onClick={onSubmit}>确定</Button>}
            destroyOnClose
            onCancel={handleCancel}
            width={500}
        >
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16, offset: 1 }}
                form={form}
                preserve={false}
                className={styles.form}
            >
                {(type === 1 || type === 2) ? (
                    <div>
                        <Form.Item label='姓名' name='username' rules={[{ required: true, message: "姓名不能为空" }]}>
                            <Input placeholder="请填写员工姓名" />
                        </Form.Item>
                        <Form.Item label='手机' name='phone' rules={[{ required: true, message: "手机号不能为空" }]}>
                            <Input placeholder="请填写员工手机号" />
                        </Form.Item>
                        <Form.Item label='部门' name='department' rules={[{ required: true, message: "部门不能为空" }]}>
                            <Input placeholder="请填写员工部门" />
                        </Form.Item>
                        <Form.Item label='账号类型' name='type' rules={[{ required: true, message: "账号类型不能为空" }]} initialValue={1}>
                            <Select className={styles.select} options={options()} />
                        </Form.Item>
                    </div>) : null
                }

                {(type === 1 || type === 3) ? (
                    <div>
                        <Form.Item label='密码' name='password1' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password placeholder="请填写密码" />
                        </Form.Item>
                        <Form.Item label='确认密码' name='password2' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password placeholder="请确认密码" />
                        </Form.Item>
                    </div>) : null}
            </Form >
        </Modal>);
}
export default UserModule