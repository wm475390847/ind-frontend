import { Button, Tabs } from 'antd';
import styles from './index.module.less';
import { useState } from 'react';
import CreateExit from '@/components/CreateExit';
import ExitMap from '@/components/ExitMap';

const ConfigPage: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [exitList, setExitList] = useState<ExitDto[]>([])
    const [tabKey, setTabKry] = useState('A')

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
                    <ExitMap exitDtoList={exitList} updateExitList={newExitList => setExitList(newExitList)} />
                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary'>保存</Button>
                    </div>
                </>}
            <CreateExit open={open} onCancel={() => setOpen(false)} onCerateSuccess={exitDto => setExitList([...exitList, exitDto])} />
        </>
    );
}
export default ConfigPage