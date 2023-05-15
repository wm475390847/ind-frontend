import { Button, Form, Input, Modal } from "antd"
import React, { useEffect, useState } from "react";
import { UserTypeEnum } from "@/constants";

type UserModuleProps = {
    type?: number
    userInfo?: UserInfo
    onCancel?: () => void
}

/**
 * 映射表
 * @param props 参数
 * @returns 
 */
export const UserModule: React.FC<UserModuleProps> = (props) => {
    const { type, userInfo, onCancel } = (props)
    const [form] = Form.useForm()
    const [open, setOpen] = useState(false)
    const [buttonLoading, setButtonLoading] = useState(false)

    const handleCancel = () => {
        setOpen(false)
        onCancel && onCancel()
    }

    const onSubmit = () => {
        form.validateFields()
            .then(values => {
                console.log(values);
                setButtonLoading(true)
            }).catch(err => {

            }).finally(() => setButtonLoading(false))
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
                    type: UserTypeEnum[userInfo.type],
                })
            }, 500);
        } else {
            setTimeout(() => {
                userInfo && form.setFieldsValue({
                    type: UserTypeEnum[userInfo.type],
                })
            }, 500);
        }
    }, [open])

    return (
        <Modal
            open={open}
            title={`${type === 2 ? '编辑' : '新增'}用户`}
            footer={<Button loading={buttonLoading} type='primary' onClick={onSubmit}>确定</Button>}
            destroyOnClose
            width={500}
            onCancel={handleCancel}
        >
            <Form
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 16, offset: 1 }}
                form={form}
                preserve={false}
                style={{ marginTop: '20px' }}
            >
                <Form.Item label='姓名' name='username' rules={[{ required: type === 1, message: "姓名不能为空" }]}>
                    <Input placeholder="请填写员工姓名"></Input>
                </Form.Item>

                <Form.Item label='手机' name='phone' rules={[{ required: type === 1, message: "手机号不能为空" }]}>
                    <Input placeholder="请填写员工手机号"></Input>
                </Form.Item>

                <Form.Item label='部门' name='department' rules={[{ required: type === 1, message: "部门不能为空" }]}>
                    <Input placeholder="请填写员工部门"></Input>
                </Form.Item>

                <Form.Item label='账号类型' name='type' rules={[{ required: type === 1, message: "账号类型不能为空" }]}>
                    <Input placeholder="默认为普通员工"></Input>
                </Form.Item>

                {type === 1 &&
                    < div >
                        <Form.Item label='密码' name='password1' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input placeholder="请填写密码"></Input>
                        </Form.Item>

                        <Form.Item label='确认密码' name='password2' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input placeholder="请确认密码"></Input>
                        </Form.Item>
                    </div>
                }
            </Form >
        </Modal>);
}
export default UserModule