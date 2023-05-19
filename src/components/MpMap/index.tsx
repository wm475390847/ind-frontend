import { Form, Input } from "antd"
import styles from './index.module.less'
import { MinusCircleTwoTone } from '@ant-design/icons';
import React, { } from "react";

type MpMapModuleProps = {
    mpList: Mp[]
    currentMpList(currentMpList: Mp[]): void
}

/**
 * 映射表
 * @param props 参数
 * @returns 
 */
export const MpMapModule: React.FC<MpMapModuleProps> = (props) => {
    const { mpList, currentMpList: updateMpList } = (props)
    const [form] = Form.useForm()

    /**
     * 删除数组元素，删除后更新父组件的list，再次传入到子组件中来更新子组件的list
     * @param index 删除的索引
     */
    const handleDeleteMp = (index: number) => {
        // 先通过扩展运算符创建一个新的数组
        const newMpList = [...mpList];
        // 删除指定索引位置的元素
        newMpList.splice(index, 1);
        updateMpList(newMpList)
    }

    return (
        <Form form={form} className={styles.form}>
            {mpList?.map((item, index) => (
                <React.Fragment key={index} >
                    <div className={styles.inputGroup}>
                        <Input className={styles.input} value={item.mpId} disabled={true} />
                        <Input className={styles.input} value={item.mpName} disabled={true} />
                        <MinusCircleTwoTone className={styles.icon} onClick={() => handleDeleteMp(index)} />
                    </div>
                </React.Fragment>
            ))}
        </Form >
    )
}
export default MpMapModule