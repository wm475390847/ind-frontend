import { Button, Form, Input, Tabs, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useState } from 'react';
import MpMapModule from '@/components/MpMap';
import moment from 'moment';
import { addMpList, getMpList, getToken, modifyToken } from '@/services';
import PollutantTableModule from '@/components/PollutantTable';
import MpTableModule from '@/components/MpTable';
import PopupModule from '@/components/Popup';

const ConfigPage: React.FC = () => {
    const [type, setType] = useState<number>()
    const [loading, setLoading] = useState(false)
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
    const handleAddMpList = () => {
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
        if (tabKey === 'A' || (loading && tabKey === 'C')) {
            handleGetMpList()
        } else if (tabKey === 'D' || (loading && tabKey !== 'C')) {
            handleGetToken()
        }
    }, [loading, tabKey])


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
                        <Button type='primary' onClick={() => setType(6)}>新增</Button>
                        <Button type='primary' onClick={() => handleAddMpList()} loading={saveButtonLoading}>保存</Button>
                    </div>
                    <PopupModule type={type} mpList={mpList} onCancel={() => setType(undefined)} onCerateSuccess={mp => setMpList([...mpList, mp])} setLoading={() => { undefined }} />
                </div>
            }

            {tabKey === 'B' &&
                <PollutantTableModule />
            }

            {tabKey === 'C' &&
                <MpTableModule mpList={mpList} />
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