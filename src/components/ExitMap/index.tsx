import { Form, Input } from "antd"
import styles from './index.module.less'
import { MinusCircleTwoTone } from '@ant-design/icons';
import React, { } from "react";

type ExitMapModalProps = {
    exitDtoList: ExitDto[]
    updateExitList(newExitList: ExitDto[]): void
}

export const ExitMap: React.FC<ExitMapModalProps> = (props) => {
    const [form] = Form.useForm()
    const { exitDtoList, updateExitList } = (props)

    /**
     * 删除数组元素，删除后更新父组件的list，再次传入到子组件中来更新子组件的list
     * @param index 删除的索引
     */
    const handleDeleteExitDto = (index: number) => {
        // 先通过扩展运算符创建一个新的数组
        const newExitList = [...exitDtoList];
        // 删除指定索引位置的元素
        newExitList.splice(index, 1);
        updateExitList(newExitList)
    }

    return (
        <Form form={form}>
            {exitDtoList?.map((item, index) => (
                <React.Fragment key={index} >
                    <div className={styles.inputGroup}>
                        <Input className={styles.input} value={item.exitId} disabled={true} />
                        <Input className={styles.input} value={item.exitName} disabled={true} />
                        <MinusCircleTwoTone className={styles.icon} onClick={() => handleDeleteExitDto(index)} />
                    </div>
                </React.Fragment>
            ))}
        </Form >
    )
}
export default ExitMap