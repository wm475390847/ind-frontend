import { ColumnsType } from "antd/lib/table"
import { useEffect, useMemo, useState } from "react"
import { InputNumber, Table, message } from 'antd'
import { getGarbageInfoList, modifyGarbage } from "@/services"
import styles from './index.module.less'

const GarbageInfoModule: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [emissionList, setEmissionList] = useState<Emission[]>()
    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
            },
            {
                title: '排放物编号',
                dataIndex: 'code',
                key: 'code',
                width: '10%',
            },
            {
                title: '排放物名称',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
            },
            {
                title: '排放标准',
                dataIndex: 'standard',
                key: 'standard',
                width: '30%',
                render: (_, record) => {
                    return (
                        <div className={styles.input}>
                            <InputNumber defaultValue={record.standard} min={0} onBlur={(e) => handleModifyGarbage(e, record.id)} />
                        </div>)
                }
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: '20%',
            }
        ]
    }, [])

    const handleModifyGarbage = (e: any, id: number) => {
        // 缓存一下
        e.persist()
        modifyGarbage({
            standard: e.target.value,
            id: id
        }).then(res => {
            message.success(res.message)
            setLoading(true)
        }).catch(err => {
            message.error(err.message)
        })
    }

    const handleGetGarbageInfoList = () => {
        getGarbageInfoList()
            .then(req => {
                setEmissionList(req.data)
                setLoading(false)
            })
            .catch(() => {
                message.error("排放标准获取失败")
            })
    }

    useEffect(() => {
        loading && handleGetGarbageInfoList()
    }, [loading])

    return (
        <Table
            columns={columns}
            dataSource={emissionList}
            rowKey='id'
            loading={loading}
            pagination={false}
            bordered
        />
    )
}

export default GarbageInfoModule