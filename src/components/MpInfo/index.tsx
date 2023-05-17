import { ColumnsType } from "antd/lib/table"
import { useMemo, useState } from "react"
import { Table } from 'antd'

type MpInfoModuleProps = {
    mpInfoList: MpInfo[]
}

const MpInfoModule: React.FC<MpInfoModuleProps> = (props) => {
    const { mpInfoList } = props

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '序号',
                dataIndex: 'id',
                key: 'id',
                width: '10%',
            },
            {
                title: '排放口ID',
                dataIndex: 'mpId',
                key: 'mpId',
                width: '10%',
            },
            {
                title: '排放口名称',
                dataIndex: 'mpName',
                key: 'mpName',
                width: '20%',
            },
            {
                title: '含氧量均值',
                dataIndex: 'o2RealAvg',
                key: 'o2RealAvg',
                width: '30%',
                // render: (_, record) => {
                //     return (
                //         <div className={styles.input}>
                //             <Input defaultValue={record.standard} min={0} onBlur={(e) => handleModifyEmission(e, record.id)} />
                //         </div>)
                // }
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: '20%',
            }
        ]
    }, [])

    return (
        <Table
            columns={columns}
            dataSource={mpInfoList}
            rowKey='id'
            pagination={false}
            bordered
        />
    )
}

export default MpInfoModule