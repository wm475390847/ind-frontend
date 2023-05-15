import { Form, Input } from "antd"
import styles from './index.module.less'
import { MinusCircleTwoTone } from '@ant-design/icons';
import React, { } from "react";

type MapModuleProps = {
    exitList: ExitDto[]
    updateExitList(newExitList: ExitDto[]): void
}

/**
 * 映射表
 * @param props 参数
 * @returns 
 */
export const MapModule: React.FC<MapModuleProps> = (props) => {
    const { exitList, updateExitList } = (props)
    const [form] = Form.useForm()

    /**
     * 删除数组元素，删除后更新父组件的list，再次传入到子组件中来更新子组件的list
     * @param index 删除的索引
     */
    const handleDeleteExit = (index: number) => {
        // 先通过扩展运算符创建一个新的数组
        const newExitList = [...exitList];
        // 删除指定索引位置的元素
        newExitList.splice(index, 1);
        updateExitList(newExitList)
    }

    return (
        <Form form={form} className={styles.form}>
            {exitList?.map((item, index) => (
                <React.Fragment key={index} >
                    <div className={styles.inputGroup}>
                        <Input className={styles.input} value={item.exitId} disabled={true} />
                        <Input className={styles.input} value={item.exitName} disabled={true} />
                        <MinusCircleTwoTone className={styles.icon} onClick={() => handleDeleteExit(index)} />
                    </div>
                </React.Fragment>
            ))}
        </Form >
    )
}
export default MapModule