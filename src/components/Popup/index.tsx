import { Button, Form, Input, Modal, Select, message } from "antd"
import React, { useEffect, useState } from "react";
import { PROJECT, UserRoleList } from "@/constants";
import styles from './index.module.less'
import { addUser, modifyAuthPassword, modifyUser, resetPassword } from "@/services";
import moment from "moment";

type AccountModuleProps = {
    type?: number
    user?: User
    mpList?: Mp[]
    onCancel?: () => void
    onCerateSuccess?: (mp: Mp) => void
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

/**
 * @param props 参数
 * @returns 
 */
export const PopupModule: React.FC<AccountModuleProps> = (props) => {
    const { type, user, onCancel, setLoading, mpList, onCerateSuccess } = (props)
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleCancel = () => {
        setOpen(false)
        onCancel && onCancel()
    }

    const parseRoleId = (value: string) => {
        return value === '管理员' ? 0 : 1
    }

    const options = () => {
        return UserRoleList.map((item, index) => ({
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
                if (user) {
                    setButtonLoading(true)
                    resetPassword({
                        id: user.id,
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
                modifyUser({
                    ...values,
                    id: user?.id,
                    roleId: parseRoleId(values.roleId)
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
                    roleId: values.roleId,
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
            if (type === 6) {
                form.validateFields().then(values => {
                    // 需要判断一下是否已经在list中
                    if (mpList) {
                        if (mpList.some((mp) => mp.mpId === values.mpId)) {
                            message.error('排放口已存在')
                            return
                        }
                        if (onCerateSuccess) {
                            onCerateSuccess({ ...values })
                        }
                        handleCancel()
                    }
                })
            }
        })
    }

    useEffect(() => {
        type && setOpen(true)
    }, [type])

    useEffect(() => {
        if (open && type === 2 && user) {
            setTimeout(() => {
                form.setFieldsValue({
                    username: user.username,
                    phone: user.phone,
                    department: user.department,
                    roleId: UserRoleList[user.roleId],
                })
            }, 500);
        }
    }, [open])

    return (
        <Modal
            open={open}
            title={`${type === 2 ? '编辑用户' : type === 3 ? '重置密码' : type === 4 ? '用户信息' : type === 5 ? '修改密码' : type === 6 ? '创建排放口' : '新增用户'}`}
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
                        <Form.Item label='账号类型' name='roleId' rules={[{ required: true, message: "账号类型不能为空" }]} initialValue={1}>
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

                {type === 4 && user &&
                    <div>
                        <Form.Item label="姓名" >{user?.username}</Form.Item>
                        <Form.Item label="手机" >{user?.phone}</Form.Item>
                        <Form.Item label="部门" >{user?.department}</Form.Item>
                        <Form.Item label="创建时间" >{moment(user?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}</Form.Item>
                    </div>
                }

                {type === 6 && mpList &&
                    <div>
                        <Form.Item name='mpId' label='排放口Id' rules={[{ required: true, message: '请输入排放口ID' }]} >
                            <Input placeholder="请输入排放口ID" />
                        </Form.Item>
                        <Form.Item name='mpName' label='排放口名称' rules={[{ required: true, message: '请输入排放口名称' }]} >
                            <Input placeholder="请输入排放口名称" />
                        </Form.Item>
                    </div>
                }

            </Form >
        </Modal>);
}
export default PopupModule