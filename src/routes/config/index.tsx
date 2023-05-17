import { Button, Form, Input, Modal, Space, Tabs, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useRef, useState } from 'react';
import CreateMpInfpModule from '@/components/CreateMpInfo';
import MpModule from '@/components/MpMap';
import moment from 'moment';
import { addMpInfoList, getMpInfoList, getTokenInfo, modifyToken } from '@/services';
import EmissionStandardModule from '@/components/EmissionStandard';
import MpInfoModule from '@/components/MpInfo';

const ConfigPage: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [mpInfoList, setMpInfoList] = useState<MpInfo[]>([])
    const [tabKey, setTabKry] = useState('A')
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
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
        setTabKry(key)
    };

    /**
     * 获取token列表
     */
    const handleGetTokenInfo = () => {
        getTokenInfo()
            .then(res => {
                setTokenInfo(res)
                setLoading(false)
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    /**
     * 修改token
     */
    const handleModifyToken = () => {
        form.validateFields().then(valus => {
            setTokenButtonLoading(true)
            modifyToken({ ...valus })
                .then(res => {
                    message.success(res.message)
                    setLoading(true)
                })
                .catch(err => {
                    message.error(err.message)
                })
                .finally(() => setTokenButtonLoading(false))
        })
    }

    /**
     * 获取排放口列表
     */
    const handleGetMpInfoList = () => {
        getMpInfoList()
            .then(res => {
                setMpInfoList(res.data)
                setLoading(false)
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    /**
     * 保存排放口列表
     */
    const handleAddMapInfoList = () => {
        addMpInfoList(mpInfoList)
            .then(res => {
                setSaveButtonLoading(true)
                message.success(res.message)
                setLoading(true)
            })
            .catch(err => {
                message.error(err.message)
            }).finally(() => setSaveButtonLoading(false))
    }

    useEffect(() => {
        if (loading && tabKey === 'A') {
            handleGetMpInfoList()
        }
        if (loading && tabKey === 'D') {
            handleGetTokenInfo()
        }
    }, [loading, tabKey])


    useEffect(() => {
        if (tabKey === 'A') {
            handleGetMpInfoList()
        }
        if (tabKey === 'D') {
            handleGetTokenInfo()
        }
        if (tabKey === 'C') {
            handleGetMpInfoList()
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
                    <MpModule mpInfoList={mpInfoList} currentMpInfoList={newMpInfoList => setMpInfoList(newMpInfoList)} />

                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary' onClick={() => handleAddMapInfoList()} loading={saveButtonLoading}>保存</Button>
                    </div>
                    <CreateMpInfpModule open={open} mpInfoList={mpInfoList} onCancel={() => setOpen(false)} onCerateSuccess={mpInfo => setMpInfoList([...mpInfoList, mpInfo])} />
                </div>
            }  

            {tabKey === 'B' &&
                <EmissionStandardModule />
            }

            {tabKey === 'C' &&
                <MpInfoModule mpInfoList={mpInfoList} />
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