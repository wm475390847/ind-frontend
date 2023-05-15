import { Button, Form, Input, Modal, Select, message } from "antd"
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

    const options = () => {
        const arr: any[] = [];
        UserTypeEnum.map((item, index) => {
            arr.push({
                value: index,
                label: item
            })
        })
        console.log(arr)
        return arr
    }

    const onSubmit = () => {
        form.validateFields().then(values => {
            console.log(values);
            if (type === 3 && values.password1 != values.password2) {
                message.error("新密码两次填写不一致")
                return
            }
            console.log("重置用户:", userInfo?.id);
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
                    type: UserTypeEnum[userInfo.type],
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
                {(type === 1 || type === 2) ? (
                    <>
                        <Form.Item label='姓名' name='username' rules={[{ required: true, message: "姓名不能为空" }]}>
                            <Input placeholder="请填写员工姓名" />
                        </Form.Item><Form.Item label='手机' name='phone' rules={[{ required: true, message: "手机号不能为空" }]}>
                            <Input placeholder="请填写员工手机号" />
                        </Form.Item><Form.Item label='部门' name='department' rules={[{ required: true, message: "部门不能为空" }]}>
                            <Input placeholder="请填写员工部门" />
                        </Form.Item><Form.Item label='账号类型' name='type' rules={[{ required: true, message: "账号类型不能为空" }]} initialValue={1}>
                            <Select
                                style={{ width: 120 }}
                                options={options()} />
                        </Form.Item>
                    </>) : null
                }

                {(type === 1 || type === 3) ? (
                    < div >
                        <Form.Item label='密码' name='password1' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password placeholder="请填写密码" />
                        </Form.Item>

                        <Form.Item label='确认密码' name='password2' rules={[{ required: true, message: "密码不能为空" }]}>
                            <Input.Password placeholder="请确认密码" />
                        </Form.Item>
                    </div>

                ) : null}
            </Form >
        </Modal>);
}
export default UserModule