import { Button, Form, Input, Modal } from "antd"

type CreateExitModalProps = {
    open: boolean
    onCancel?: () => void
    onCerateSuccess: (exitDto: ExitDto) => void
}

export const CreateExit: React.FC<CreateExitModalProps> = (props) => {
    const [form] = Form.useForm()
    const { open, onCancel, onCerateSuccess } = (props)

    const handleCancel = () => {
        onCancel && onCancel()
    }

    const onSubmit = () => {
        form.validateFields().then(values => {
            onCerateSuccess({ ...values })
            handleCancel()
        })
    }

    return (
        <Modal
            open={open}
            title="创建排放口"
            onCancel={handleCancel}
            footer={<Button type='primary' onClick={onSubmit}>确定</Button>}
            destroyOnClose
            width={300}
        >
            <Form
                preserve={false}
                form={form}>
                <Form.Item name="exitId" rules={[{ required: true, message: '请输入排放口id' }]} >
                    <Input placeholder="ID" />
                </Form.Item>
                <Form.Item name="exitName" rules={[{ required: true, message: '请输入排放口名称' }]} >
                    <Input placeholder="名称" />
                </Form.Item>
            </Form>
        </Modal >
    )
}
export default CreateExit