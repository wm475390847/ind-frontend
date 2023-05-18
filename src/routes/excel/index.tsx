import { Button, Input } from "antd";
import React, { useState } from "react";
import styles from './index.module.less'

const Execl: React.FC = () => {

    const mpList = [
        '1',
        '2',
        '3',
        '4',
        '5'
    ]

    // 接口数据，先使用模拟的
    const hourDataList = {
        "a": [
            { houe: 0, data: 100 },
            { houe: 1, data: 99 },
            { houe: 2, data: 98 },
            { houe: 3, data: 97 },
            { houe: 4, data: 96 },
            { houe: 5, data: 95 },
            { houe: 6, data: 94 },
            { houe: 7, data: 93 }
        ],
        "b": [
            { houe: 0, data: 100 },
            { houe: 1, data: 99 },
            { houe: 2, data: 98 },
            { houe: 3, data: 97 },
            { houe: 4, data: 96 },
            { houe: 5, data: 95 },
            { houe: 6, data: 94 },
            { houe: 7, data: 93 }
        ]
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <table border={1} cellSpacing={0} >
                    <tr>
                        <td className={styles.td} colSpan={5}>小时排放预测</td>
                    </tr>
                    <tr>
                        <td colSpan={2} rowSpan={5}></td>
                        <td colSpan={2} rowSpan={5}></td>
                        <td style={{ width: '200px', height: '25px', textAlign: 'center' }}>今日班组排放均值</td>
                    </tr>
                    <tr>
                        <td style={{ width: '200px', height: '50px' }}>第三行，第五列</td>
                    </tr>
                    <tr>
                        <td style={{ width: '200px', height: '50px' }}>第四行，第五列</td>
                    </tr>
                    <tr>
                        <td style={{ width: '200px', height: '50px' }}>第五行，第五列</td>
                    </tr>
                    <tr>
                        <td style={{ width: '200px', height: '50px' }}>第六行，第五列</td>
                    </tr>
                    <tr>
                        <td style={{ width: '150px', height: '50px' }}>第七行，第一列</td>
                        <td style={{ width: '150px', height: '50px' }}>第七行，第二列</td>
                        <td style={{ width: '450px', height: '50px' }}>第七行，第三列</td>
                        <td style={{ width: '150px', height: '50px' }}>第七行，第四列</td>
                        <td style={{ width: '200px', height: '50px' }}>第七行，第五列</td>
                    </tr>
                    <tr>
                        <td style={{ width: '150px', height: '75px' }}>第八行，第一列</td>
                        <td style={{ width: '150px', height: '75px' }}>第八行，第二列</td>
                        <td style={{ width: '450px', height: '75px' }}>第八行，第三列</td>
                        <td style={{ width: '150px', height: '75px' }}>第八行，第四列</td>
                        <td style={{ width: '200px', height: '75px' }}>第八行，第五列</td>
                    </tr>
                </table>
            </div>
            <div style={{ marginLeft: "23px" }}>
                {mpList.map((item, index) => (
                    <Button type="primary" style={{ width: '100px', marginTop: '10px' }} >{item}</Button>))}
            </div>

        </div >
    );
};

export default Execl;
