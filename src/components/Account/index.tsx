import { Button, Form, Input, Modal, Select, message } from "antd"
import React, { useEffect, useState } from "react";
import { PROJECT, UserTypeList } from "@/constants";
import styles from './index.module.less'
import { addUser, modifyAuthPassword, modifyUserInfo, resetPassword } from "@/services";
import moment from "moment";

type AccountModuleProps = {
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
export const AccountModule: React.FC<AccountModuleProps> = (props) => {
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
                if (values.newPassword1 != values.newPassword2) {
                    message.error("新密码两次填写不一致")
                    return
                }
                if (userInfo) {
                    setButtonLoading(true)
                    resetPassword({
                        id: userInfo.id,
                        password: values.newPassword1
                    }).then(req => {
                        message.success(req.message)
                        handleCancel()
                        setLoading(true)
                    }).catch(err => message.error(err.message))
                        .finally(() => setButtonLoading(false))
                }
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
                if (values.newPassword1 != values.newPassword2) {
                    message.error("密码两次填写不一致")
                    return
                }
                setButtonLoading(true)
                addUser({
                    project: PROJECT,
                    username: values.username,
                    department: values.department,
                    type: values.type,
                    phone: values.phone,
                    password: values.newPassword1
                })
                    .then(res => {
                        message.success(res.message)
                        handleCancel()
                        setLoading(true)
                    }).catch(err => message.error(err.message))
                    .finally(() => setButtonLoading(false))
            }
            if (type === 5) {
                if (values.newPassword1 != values.newPassword2) {
                    message.error("新密码两次填写不一致")
                    return
                }
                setButtonLoading(true)
                modifyAuthPassword({
                    password: values.oldPassword,
                    newPassword: values.newPassword1,
                }).then(res => {
                    message.success(res.message)
                    handleCancel()
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
                    newPassword1: null,
                    newPassword2: null,
                    oldPassword: null
                })
            }, 500);
        }
    }, [open])

    return (
        <Modal
            open={open}
            title={`${type === 2 ? '编辑用户' : type === 3 ? '重置密码' : type === 4 ? '用户信息' : type === 5 ? '修改密码' : '新增用户'}`}
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
                            <Input maxLength={10} placeholder="请填写员工姓名" />
                        </Form.Item>
                        <Form.Item label='手机' name='phone' rules={[{ required: true, message: "手机号不能为空" }]}>
                            <Input maxLength={11} placeholder="请填写员工手机号" />
                        </Form.Item>
                        <Form.Item label='部门' name='department' rules={[{ required: true, message: "部门不能为空" }]}>
                            <Input placeholder="请填写员工部门" />
                        </Form.Item>
                        <Form.Item label='账号类型' name='type' rules={[{ required: true, message: "账号类型不能为空" }]} initialValue={1}>
                            <Select className={styles.select} options={options()} />
                        </Form.Item>
                    </div>) : null
                }

                {type === 5 &&
                    <div>
                        <Form.Item name="oldPassword" label="原密码" rules={[{ required: true, message: '原密码不能为空' }]}>
                            <Input.Password placeholder="请输入原密码" />
                        </Form.Item>
                    </div>
                }

                {(type === 1 || type === 3 || type === 5) ? (
                    <div>
                        <Form.Item label='密码' name='newPassword1' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password maxLength={20} placeholder="请填写密码" />
                        </Form.Item>
                        <Form.Item label='确认密码' name='newPassword2' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password maxLength={20} placeholder="请确认密码" />
                        </Form.Item>
                    </div>) : null}

                {type === 4 && userInfo &&
                    <div>
                        <Form.Item label="姓名" >{userInfo?.username}</Form.Item>
                        <Form.Item label="手机" >{userInfo?.phone}</Form.Item>
                        <Form.Item label="部门" >{userInfo?.department}</Form.Item>
                        <Form.Item label="创建时间" >{moment(userInfo?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
                    </div>
                }
            </Form >
        </Modal>);
}
export default AccountModule