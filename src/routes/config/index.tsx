import { Button, Form, Input, List, Tabs, TabsProps } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import styles from './index.module.less';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import CreateExit from '@/components/CreateExit';

const ConfigPage: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    const onChange = (key: string) => {
        console.log(key);
    };

    const handleSubmit = () => {

    }

    const handleDelete = () => {

    }

    return (
        <>
            <Tabs defaultActiveKey="1" onChange={onChange}>
                <TabPane tab='排放口' key='A'>
                    <div className={styles.buttonGroup}>
                        <Button type='primary' onClick={() => setOpen(true)}>新增</Button>
                        <Button type='primary'>保存</Button>
                    </div>

                </TabPane>

                <TabPane tab='排放标准' key='B'>

                </TabPane>
                <TabPane tab='含氧量标定' key='C'>

                </TabPane>
                <TabPane tab='API Token' key='D'>

                </TabPane>

                <TabPane tab='班组' key='E'>

                </TabPane>
            </Tabs>

            <CreateExit open={open} onCancel={() => setOpen(false)} />
        </>
    );
}

export default ConfigPage