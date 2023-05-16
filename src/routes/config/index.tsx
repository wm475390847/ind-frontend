import { Button, Form, Input, Modal, Space, Tabs, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useRef, useState } from 'react';
import CreateExitModule from '@/components/CreateExit';
import MapModule from '@/components/Map';
import moment from 'moment';
import { addExitList, getExitList, getTokenInfo, modifyToken } from '@/services';
import EmissionStandardModule from '@/components/EmissionStandard';

const ConfigPage: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [exitList, setExitList] = useState<ExitDto[]>([])
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
    const handleGetExitList = () => {
        getExitList()
            .then(res => {
                setExitList(res.data)
                setLoading(false)
            })
            .catch(err => {
                message.error(err.message)
            })
    }

    /**
     * 保存排放口列表
     */
    const saveExitList = () => {
        addExitList(exitList)
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
            handleGetExitList()
        }
        if (loading && tabKey === 'D') {
            handleGetTokenInfo()
        }
    }, [loading, tabKey])


    useEffect(() => {
        if (tabKey === 'A') {
            handleGetExitList()
        }
        if (tabKey === 'D') {
            handleGetTokenInfo()
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
                <div className={styles.exitWrap}>
                    <div className={styles.titleGroup}>
                        <div className={styles.title}>排放口ID</div>
                        <div className={styles.title}>排放口名称</div>
                    </div>

                    {/* 循环添加组件，也可以点击减号删除，主要看list的内容 */}
                    <MapModule exitList={exitList} updateExitList={newExitList => setExitList(newExitList)} />

                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary' onClick={() => saveExitList()} loading={saveButtonLoading}>保存</Button>
                    </div>
                </div>
            }

            {tabKey === 'B' &&
                <EmissionStandardModule />
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

            <CreateExitModule open={open} onCancel={() => setOpen(false)} onCerateSuccess={exitDto => setExitList([...exitList, exitDto])} />
        </>
    );
}
export default ConfigPage