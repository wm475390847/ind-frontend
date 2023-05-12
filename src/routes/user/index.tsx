import { ColumnsType } from "antd/lib/table"
import { useEffect, useMemo, useState } from "react"
import { Button, Popconfirm, Table } from 'antd'
import { getUserList } from "@/services"
import { UserInfo } from "@/services/interface"
import styles from './index.module.less'
import moment from "moment"
import { UserTypeEnum } from "@/constants"

const UserPage: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtongLoading] = useState(false)

    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [total, setTotal] = useState(0)

    const [userList, setUserList] = useState<UserInfo[]>()

    const columns = useMemo<ColumnsType<any>>(() => {
        return [
            {
                title: '序号',
                width: '5%',
                render: (_text, _record, index) => (pageNo as number - 1) * (pageSize as number) + index + 1
            },
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
                width: '10%'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                key: 'phone',
                width: '15%',
            },
            {
                title: '部门',
                dataIndex: 'department',
                key: 'department',
                width: '10%',
            },
            {
                title: '创建时间',
                dataIndex: 'gmtCreate',
                key: 'gmtCreate',
                width: '15%',
                render: (gmtCreate) => gmtCreate && moment(gmtCreate).format('YYYY-MM-DD HH:mm:ss')
            },
            {
                title: '用户类型',
                dataIndex: 'type',
                key: 'type',
                width: '10%',
                render: (type) => <div>{UserTypeEnum[type]}</div>
            },
            {
                title: '操作',
                dataIndex: 'action',
                key: 'action',
                width: '15%',
                render: (_, record) => {
                    return (
                        <div className={styles.tableAction}>
                            <Button type="primary" onClick={undefined}>编辑</Button>
                            <Popconfirm title='确定删除？' placement="top" okText="是" cancelText="否" >
                                <Button loading={buttonLoading}>删除</Button>
                            </Popconfirm>
                            <Button onClick={undefined}>重置密码</Button>
                        </div >
                    )
                }
            }
        ]
    }, [pageNo, pageSize])

    const onChangeTable = (value: any) => {
        const { current, pageSize } = value
        setPageNo(current)
        setPageSize(pageSize)
        setLoading(true)
    }

    const handleGetUserList = () => {
        getUserList({
            pageNo: pageNo,
            pageSize: pageSize,
        }).then(data => {
            setUserList(data.records)
            setTotal(data.total)
            setLoading(false)
        })
    }

    useEffect(() => {
        loading && handleGetUserList()
    }, [pageNo, loading])

    return (
        <div>
            <div className={styles.action}>
                <Button type='primary'>新增用户</Button>
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={userList}
                    rowKey='id'
                    pagination={{ total, current: pageNo, showSizeChanger: true }}
                    loading={loading}
                    onChange={onChangeTable}
                    className={styles.table}
                />
            </div>
            {/* 报告组件 */}
            {/* {status == 3 && <TaskReportModal taskInfo={taskInfo} onCancel={() => setTaskInfo(undefined)} />} */}
            {/* 编辑组件 */}
            {/* {status == 2 && <UpdateTaskModal taskInfo={taskInfo} setLoading={setLoading} onCancel={() => setTaskInfo(undefined)} />} */}
        </div>
    )
}

export default UserPage