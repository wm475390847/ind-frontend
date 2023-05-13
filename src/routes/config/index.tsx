import { Button, Form, Input, Space, Tabs } from 'antd';
import styles from './index.module.less';
import { useState } from 'react';
import CreateExit from '@/components/CreateExit';
import Map from '@/components/Map';
import moment from 'moment';

const ConfigPage: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [exitList, setExitList] = useState<ExitDto[]>([])
    const [tabKey, setTabKry] = useState('A')
    const [modifyTime, setModifyTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss'))

    const items = [
        { label: '排放口', key: 'A', },
        { label: '排放标准', key: 'B', },
        { label: '含氧量标定', key: 'C', },
        { label: 'API Token', key: 'D', },
        { label: '班组', key: 'E', },
    ];

    const onChange = (key: string) => {
        setTabKry(key)
    };

    const handleSubmit = () => {

    }

    const handleDelete = () => {

    }

    return (
        <>
            <Tabs defaultActiveKey="A" onChange={onChange} items={items} />
            {tabKey === 'A' &&
                <>
                    <Map exitDtoList={exitList} updateExitList={newExitList => setExitList(newExitList)} />
                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary'>保存</Button>
                    </div>
                </>
            }

            {tabKey === 'D' &&
                <Form >
                    <div className={styles.formGroup}>
                        <Form.Item label="TokenId" name='tokenId' rules={[{ required: true, message: '请输入TokenId' }]}>
                            <Space.Compact >
                                <Input className={styles.tokenInput} />
                                <Button type="primary">提交</Button>
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item label="最近更新时间" name='modifyTime' className={styles.timeItem}>
                            <Space.Compact >
                                <Input className={styles.timeInput} disabled={true} placeholder={modifyTime} />
                            </Space.Compact>
                        </Form.Item>
                    </div>
                </Form>
            }
            <CreateExit open={open} onCancel={() => setOpen(false)} onCerateSuccess={exitDto => setExitList([...exitList, exitDto])} />
        </>
    );
}
export default ConfigPage