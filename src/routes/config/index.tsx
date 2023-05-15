import { Button, Form, Input, Modal, Space, Tabs, message } from 'antd';
import styles from './index.module.less';
import { useEffect, useRef, useState } from 'react';
import CreateExitModule from '@/components/CreateExit';
import MapModule from '@/components/Map';
import moment from 'moment';
import { getTokenInfo, modifyToken } from '@/services';

const ConfigPage: React.FC = () => {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [exitList, setExitList] = useState<ExitDto[]>([])
    const [tabKey, setTabKry] = useState('A')
    const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
    const [buttongLoading, setButtonLoading] = useState(false)
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

    const handleModifyToken = () => {
        form.validateFields().then(valus => {
            console.log(valus);
            setButtonLoading(true)
            modifyToken({ ...valus })
                .then(res => {
                    message.success(res.message)
                    setLoading(true)
                })
                .catch(err => {
                    message.error(err.message)
                })
                .finally(() => setButtonLoading(false))
        })
    }

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

    useEffect(() => {
        if (loading && tabKey == 'D') {
            handleGetTokenInfo()
        }
    }, [loading, tabKey])

    useEffect(() => {
        tokenInfo && form.setFieldsValue({
            tokenId: tokenInfo.tokenId
        })
    }, [tokenInfo, form])

    return (
        <>
            <Tabs defaultActiveKey="A" onChange={onTabsChange} items={items} />
            {tabKey === 'A' &&
                <>
                    <MapModule exitDtoList={exitList} updateExitList={newExitList => setExitList(newExitList)} />
                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary'>保存</Button>
                    </div>
                </>
            }

            {tabKey === 'D' && tokenInfo &&
                <Form
                    form={form}
                    className={styles.form}
                >
                    <Form.Item
                        label='TokenId'
                        name='tokenId'
                        rules={[{ required: true, message: '请输入tokenId' }]}
                    >
                        <Input className={styles.input} />
                    </Form.Item >

                    <Form.Item>
                        <Button type="primary" onClick={() => handleModifyToken()} loading={buttongLoading}>提交</Button>
                    </Form.Item>

                    <Form.Item label='最近更新时间' className={styles.timeItem}>
                        {moment(tokenInfo?.gmtCreate).format('YYYY-MM-DD HH:mm:ss')}
                    </Form.Item>
                </Form >
            }

            <CreateExitModule open={open} onCancel={() => setOpen(false)} onCerateSuccess={exitDto => setExitList([...exitList, exitDto])} />
        </>
    );
}
export default ConfigPage