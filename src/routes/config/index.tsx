import { Button, Form, Input, Modal, Space, Tabs, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useRef, useState } from 'react';
import CreateMpModule from '@/components/CreateMp';
import MpMapModule from '@/components/MpMap';
import moment from 'moment';
import { addMpList, getMpList, getToken, modifyToken } from '@/services';
import PollutantModule from '@/components/Pollutant';
import MpModule from '@/components/Mp';

const ConfigPage: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [mpList, setMpList] = useState<Mp[]>([])
    const [tabKey, setTabKey] = useState('A')
    const [tokenInfo, setTokenInfo] = useState<Token>()
    const [tokenButtonLoading, setTokenButtonLoading] = useState(false)
    const [saveButtonLoading, setSaveButtonLoading] = useState(false)
    const [form] = Form.useForm()
    const items = [
        { label: '排放口', key: 'A', },
        { label: '排放标准', key: 'B', },
        { label: '含氧量标定', key: 'C', },
        { label: 'API Token', key: 'D', },
        { label: '班组', key: 'E', },
    ];

    const onTabsChange = (key: string) => {
        setTabKey(key)
    };

    /**
     * 获取token列表
     */
    const handleGetToken = () => {
        getToken()
            .then(res => {
                setTokenInfo(res)
                setLoading(false)
            })
            .catch(err => message.error(err.message))
    }

    /**
     * 修改token
     */
    const handleModifyToken = () => {
        form.validateFields()
            .then(valus => {
                setTokenButtonLoading(true)
                modifyToken({ ...valus })
                    .then(res => {
                        message.success(res.message)
                        setLoading(true)
                    })
                    .catch(err => message.error(err.message))
                    .finally(() => setTokenButtonLoading(false))
            })
    }

    /**
     * 获取排放口列表
     */
    const handleGetMpList = () => {
        getMpList()
            .then(res => {
                setMpList(res.data)
                setLoading(false)
            })
            .catch(err => message.error(err.message))
    }

    /**
     * 保存排放口列表
     */
    const handleAddMapList = () => {
        addMpList(mpList)
            .then(res => {
                setSaveButtonLoading(true)
                message.success(res.message)
                setLoading(true)
            })
            .catch(err => message.error(err.message))
            .finally(() => setSaveButtonLoading(false))
    }

    useEffect(() => {
        if (loading && tabKey === 'A') {
            handleGetMpList()
        }
        if (loading && tabKey === 'D') {
            handleGetToken()
        }
    }, [loading, tabKey])


    useEffect(() => {
        if (tabKey === 'A') {
            handleGetMpList()
        }
        if (tabKey === 'D') {
            handleGetToken()
        }
        if (tabKey === 'C') {
            handleGetMpList()
        }
    }, [tabKey])

    useEffect(() => {
        tokenInfo && form.setFieldsValue({
            tokenId: tokenInfo.tokenId
        })
    }, [tokenInfo])

    return (
        <>
            <Tabs defaultActiveKey="A" onChange={onTabsChange} items={items} />
            {tabKey === 'A' &&
                <div className={styles.mpWrap}>
                    <div className={styles.titleGroup}>
                        <div className={styles.title}>排放口ID</div>
                        <div className={styles.title}>排放口名称</div>
                    </div>

                    {/* 循环添加组件，也可以点击减号删除，主要看list的内容 */}
                    <MpMapModule mpList={mpList} currentMpList={newMpList => setMpList(newMpList)} />

                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary' onClick={() => handleAddMapList()} loading={saveButtonLoading}>保存</Button>
                    </div>
                    <CreateMpModule open={open} mpInfoList={mpList} onCancel={() => setOpen(false)} onCerateSuccess={mpInfo => setMpList([...mpList, mpInfo])} />
                </div>
            }

            {tabKey === 'B' &&
                <PollutantModule />
            }

            {tabKey === 'C' &&
                <MpModule mpList={mpList} />
            }

            {tabKey === 'D' && tokenInfo &&
                <div className={styles.tokenWrap}>
                    <Form form={form} className={styles.form}>
                        <Form.Item label='TokenId' name='tokenId' rules={[{ required: true, message: '请输入tokenId' }]}>
                            <Input className={styles.input} />
                        </Form.Item >
                        <Form.Item>
                            <Button type="primary" onClick={() => handleModifyToken()} loading={tokenButtonLoading}>提交</Button>
                        </Form.Item>
                        <Form.Item label='最近更新时间' className={styles.item}>
                            {moment(tokenInfo?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
                        </Form.Item>
                    </Form >
                </div>
            }

        </>
    );
}
export default ConfigPage