import { ColumnsType } from "antd/lib/table"
import { useEffect, useMemo, useState } from "react"
import { Table } from 'antd'
import moment from "moment"

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
                width: '20%',
            },
            {
                title: '氧含量均值',
                dataIndex: 'o2StandardAvg',
                key: 'o2StandardAvg',
                width: '15%',
            },
            {
                title: '单位',
                dataIndex: 'unit',
                key: 'unit',
                width: '15%',
            },
            {
                title: '更新时间',
                dataIndex: 'gmtModified',
                key: 'gmtModified',
                width: '20%',
                render: (gmtCreate) => gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')
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