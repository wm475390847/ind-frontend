import { Button, Form, Input, Modal } from "antd"
import styles from './index.module.less'

type CreateExitModuleProps = {
    open: boolean
    onCancel?: () => void
    onCerateSuccess: (exitDto: ExitDto) => void
}
/**
 * 创建排放口
 * @param props 参数
 * @returns 
 */
export const CreateExitModule: React.FC<CreateExitModuleProps> = (props) => {
    const { open, onCancel, onCerateSuccess } = (props)
    const [form] = Form.useForm()

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
            width={350}
        >
            <Form
                className={styles.form}
                preserve={false}
                form={form}>
                <Form.Item name="exitId" rules={[{ required: true, message: '请输入排放口ID' }]} >
                    <Input placeholder="请输入排放口ID" />
                </Form.Item>
                <Form.Item name="exitName" rules={[{ required: true, message: '请输入排放口名称' }]} >
                    <Input placeholder="请输入排放口名称" />
                </Form.Item>
            </Form>
        </Modal >
    )
}
export default CreateExitModule