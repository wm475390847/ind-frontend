import { ColumnsType } from "antd/lib/table"
import { useEffect, useMemo, useState } from "react"
import { Table } from 'antd'

type MpInfoModuleProps = {
    mpInfoList: MpInfo[]
}

const MpInfoModule: React.FC<MpInfoModuleProps> = (props) => {
    const { mpInfoList } = props
    const [dataSource, serDataSource] = useState<MpInfo[]>()

    const handleModifyMpInfoList = () => {
        serDataSource(mpInfoList.map(e => ({ ...e, unit: "毫克每立方米" })))
    }

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
                width: '20%',
            },
            {
                title: '排放口名称',
                dataIndex: 'mpName',
                key: 'mpName',
                width: '25%',
            },
            {
                title: '含氧量均值',
                dataIndex: 'o2RealAvg',
                key: 'o2RealAvg',
                width: '25%',
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: '20%',
            }
        ]
    }, [])

    useEffect(() => {
        mpInfoList && handleModifyMpInfoList()
    }, [mpInfoList])

    return (
        <Table
            columns={columns}
            dataSource={dataSource}
            rowKey='id'
            pagination={false}
            bordered
        />
    )
}

export default MpInfoModule