import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from './index.module.less'
import { getMpList, getPollutantList, getAvgData } from "@/services";
import { GroupIdList } from "@/constants";

const DataBoard: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [groupHourAvg, setGroupHourAvg] = useState<GroupHourAvg[]>([])
    const [shiftHourAvg, setShiftHourAvg] = useState<ShiftHourAvg[]>([])
    const [shiftValue, setShiftValue] = useState()
    const [groupValue, setGroupValue] = useState()

    // 数据源
    const [mpList, setMpList] = useState<Mp[]>([])
    const [pollutantList, setPollutantList] = useState<Pollutant[]>([])

    // 筛选结果需要的参数
    const [mpItem, setMpItem] = useState<Mp>()
    const [pollutantItem, setPollutantItem] = useState<Pollutant>()

    // 操作排放口索引
    const [activeMpIndex, setActiveMpIndex] = useState(-1);
    // 操作污染物索引
    const [activePollutantIndex, setActivePollutantIndex] = useState(-1);

    /**
     * 获取班次数据值
     * @param mpId 排放口id
     * @param pollutantCode 污染物编码 
     * @returns 
     */
    const handleGetShiftValue = (mpId: string, pollutantCode: string) => {
        console.log(shiftHourAvg);
        console.log(mpId, pollutantCode);
        // 根据 mpId 查找目标对象
        const targetObj = shiftHourAvg.find(item => item.mpId === mpId);
        // 如果找到了对应的对象，则获取其 value 属性的值
        if (targetObj) {
            const valueObj = targetObj.value as { [key: string]: any };
            // 检查 valueObj 中是否包含指定的 pollutant 属性
            if (pollutantCode in valueObj) {
                return valueObj[pollutantCode];
            }
        }
        return null;
    }

    /**
     * 获取平均数据
     */
    const handleAvgData = () => {
        getAvgData()
            .then(res => {
                setGroupHourAvg(res.data.groupHourAvg)
                setShiftHourAvg(res.data.shiftHourAvg)
            }).catch(err => { })
    }

    /**
     * 获取排放口列表
     */
    const handleGetMpList = () => {
        getMpList().then(rep => setMpList(rep.data)).catch(err => { })
    }

    /**
     * 获取污染物列表
     */
    const handleGetPollutantList = () => {
        getPollutantList().then(rep => setPollutantList(rep.data)).catch(err => { })
    }

    /**
     * 点击排放口
     * @param index 索引
     */
    const handleClickMp = (item: any, index: any) => {
        setMpItem(item);
        setActiveMpIndex(activeMpIndex === index ? -1 : index);
    };

    /**
     * 点击污染物
     * @param index 索引
     */
    const handleClickPollutant = (item: any, index: any) => {
        setPollutantItem(item);
        setActivePollutantIndex(activePollutantIndex === index ? -1 : index);
    };

    useEffect(() => {
        handleGetMpList()
        handleAvgData()
        handleGetPollutantList()
    }, [loading])

    /**
     * 监听一下按钮的变化，然后获取对应的数据
     */
    useEffect(() => {
        mpItem && pollutantItem && setShiftValue(handleGetShiftValue(mpItem.mpId, pollutantItem.code));
    }, [mpItem, pollutantItem])

    return (

        <div className={styles.wrap}>

            <table border={1} cellSpacing={0}>
                <tbody>

                    <tr>
                        <td className={styles.td1} colSpan={5}>小时排放预测『{mpItem?.mpName}』</td>
                    </tr>
                    <tr>
                        <td colSpan={2} rowSpan={5}>{shiftValue == null ? '暂无数据' : JSON.stringify(shiftValue)}</td>
                        <td colSpan={2} rowSpan={5} className={styles.td3}>草泥马</td>
                        <td className={styles.td4}>今日班组排放均值</td>
                    </tr>
                    <tr>
                        <td className={styles.td5}>{GroupIdList[0]}值mg/m³</td>
                    </tr>
                    <tr>
                        <td className={styles.td5} >{GroupIdList[1]}值mg/m³</td>
                    </tr>
                    <tr>
                        <td className={styles.td5}>{GroupIdList[2]}值mg/m³</td>
                    </tr>
                    <tr>
                        <td className={styles.td5}>{GroupIdList[3]}值mg/m³</td>
                    </tr>
                    <tr>
                        <td className={styles.td6}>剩余分钟数min</td>
                        <td className={styles.td6}>控制含氧量%</td>
                        <td className={styles.td7}>剩余实测浓度%</td>
                        <td className={styles.td7}>当前折算均值mg/m³</td>
                        <td className={styles.td8}>本小时排放预测</td>
                    </tr>
                    <tr>
                        <td className={styles.td6}>第八行，第一列</td>
                        <td className={styles.td6}>第八行，第二列</td>
                        <td className={styles.td7}>第八行，第三列</td>
                        <td className={styles.td7}>第八行，第四列</td>
                        <td className={styles.td8}>第八行，第五列</td>
                    </tr>
                </tbody>
            </table>


            <div style={{ marginTop: '10px' }}>
                <div className={styles.buttonGroup}>
                    {mpList.map((item, index) => (
                        <Button
                            key={index}
                            className={`${styles.button} ${index === activeMpIndex ? styles.active : ''}`}
                            onClick={() => handleClickMp(item, index)}
                        >
                            {item.mpName}
                        </Button>
                    ))}
                </div>
                <div className={styles.buttonGroup}>
                    {pollutantList.map((item, index) => (
                        <Button
                            key={index}
                            className={`${styles.button} ${index === activePollutantIndex ? styles.active : ''}`}
                            onClick={() => handleClickPollutant(item, index)}
                        >
                            {item.name}
                        </Button>
                    ))}
                </div>
            </div>

            <div className={styles.actionButtonGroup} >
                <Button type="primary">查询</Button>
                <Button type="primary">更新</Button>
            </div>
        </div>

    );
};

export default DataBoard;
