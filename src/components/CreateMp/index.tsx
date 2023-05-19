import { Button, Form, Input, Modal, message } from "antd"
import styles from './index.module.less'

type CreateMpModuleProps = {
    open: boolean
    mpInfoList: Mp[]
    onCancel?: () => void
    onCerateSuccess: (mpInfo: Mp) => void
}
/**
 * 创建排放口
 * @param props 参数
 * @returns 
 */
export const CreateMpModule: React.FC<CreateMpModuleProps> = (props) => {
    const { open, mpInfoList, onCancel, onCerateSuccess } = (props)
    const [form] = Form.useForm()

    const handleCancel = () => {
        onCancel && onCancel()
    }

    const onSubmit = () => {
        form.validateFields().then(values => {
            // 需要判断一下是否已经在list中
            if (mpInfoList.some((mp) => mp.mpId === values.mpId)) {
                message.error('排放口已存在')
                return
            }
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
                <Form.Item name="mpId" rules={[{ required: true, message: '请输入排放口ID' }]} >
                    <Input placeholder="请输入排放口ID" />
                </Form.Item>
                <Form.Item name="mpName" rules={[{ required: true, message: '请输入排放口名称' }]} >
                    <Input placeholder="请输入排放口名称" />
                </Form.Item>
            </Form>
        </Modal >
    )
}
export default CreateMpModule