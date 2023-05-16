import { ColumnsType } from "antd/lib/table"
import { useEffect, useMemo, useState } from "react"
import { Input, Table, message } from 'antd'
import { getEmisssionList, modifyEmission } from "@/services"
import styles from './index.module.less'

const EmissionStandardModule: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [emissionList, setEmissionList] = useState<Emission[]>()
    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '20',
            },
            {
                title: '排放物',
                dataIndex: 'emission',
                key: 'emission',
                width: '20',
            },
            {
                title: '排放标准',
                dataIndex: 'standard',
                key: 'standard',
                width: '40%',
                render: (_, record) => {
                    console.log(record);
                    return (
                        <div className={styles.input}>
                            <Input defaultValue={record.standard} min={0} onPressEnter={(e) => handleModifyEmission(e, record.id)} onBlur={(e) => handleModifyEmission(e, record.id)} />
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

    const handleModifyEmission = (e: any, id: number) => {
        // 缓存一下
        e.persist()
        modifyEmission({
            standard: e.target.value,
            id: id
        }).then(res => {
            message.success(res.message)
            setLoading(false)
        }).catch(err => {
            message.error(err.message)
        })
    }

    const handleGetEmissionList = () => {
        getEmisssionList()
            .then(data => {
                setEmissionList(data.records)
                setLoading(false)
            })
            .catch(() => {
                message.error("排放标准获取失败")
            })
    }

    useEffect(() => {
        loading && handleGetEmissionList()
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

export default EmissionStandardModule