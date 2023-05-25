import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from './index.module.less'
import { getMpList, getPollutantList, getAvgData, execute } from "@/services";
import { GroupIdList } from "@/constants";

const DataBoard: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtongLoading] = useState(false)

    const [groupHourAvg, setGroupHourAvg] = useState<GroupHourAvg[]>([])
    const [shiftHourAvg, setShiftHourAvg] = useState<ShiftHourAvg[]>([])
    const [shiftObject, setShiftObj] = useState<any>()
    const [groupObject, setGroupObj] = useState<any>()

    // 数据源
    const [mpList, setMpList] = useState<Mp[]>([])
    const [pollutantList, setPollutantList] = useState<Pollutant[]>([])

    // 筛选结果需要的参数
    const [mp, setMp] = useState<Mp>()
    const [pollutant, setPollutant] = useState<Pollutant>()

    // 操作排放口索引、操作污染物索引
    const [activeMpIndex, setActiveMpIndex] = useState(0);
    const [activePollutantIndex, setActivePollutantIndex] = useState(0);

    /**
     * 获取班次数据值
     * @param mpId 排放口id
     * @param pollutantCode 污染物编码 
     * @returns 
     */
    const handleGetShiftObj = (mpId: string, pollutantCode: string) => {
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
     * 获取班组排放均值
     * @param mpId 排放口id
     * @param pollutantCode 污染物编码 
     */
    const handleGetGroupObj = (mpId: string, pollutantCode: string) => {
        // 根据 mpId 查找目标对象
        const targetObj = groupHourAvg.find(item => item.mpId === mpId);
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
     * 获取班组今日排放均值
     * @param groupId 班组id
     * @returns 排放均值
     */
    const handleGetGroupValue = (groupId: string) => {
        if (groupObject) {
            if (groupId in groupObject) {
                return groupObject[groupId]
            }
            return 0
        }
        return 0;
    }

    /**
     * 处理当前班次均值，排序
     * @returns 排放均值
     */
    const handleParseShiftAvg = () => {
        if (shiftObject) {
            const entries = Object.entries(shiftObject); // 获取所有属性键值对
            entries.sort(([keyA], [keyB]) => keyA.localeCompare(keyB, 'zh-Hans-CN')); // 按照键的大小顺序排序
            return entries;
        }
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
        setMp(item);
        setActiveMpIndex(activeMpIndex === index ? -1 : index);
    };

    /**
     * 点击污染物
     * @param index 索引
     */
    const handleClickPollutant = (item: any, index: any) => {
        setPollutant(item);
        setActivePollutantIndex(activePollutantIndex === index ? -1 : index);
    };

    /**
     * 重新执行数据计算
     */
    const handleResetData = () => {
        setButtongLoading(true)
        execute().then(res => {
            message.success(res.message)
            setLoading(false)
        }).catch(err => message.error(err.message))
            .finally(() => setButtongLoading(false))
    }

    /**
     * 监听页面是否刷新，如果重新加载了则调用所有接口
     */
    useEffect(() => {
        handleGetMpList()
        handleAvgData()
        handleGetPollutantList()
    }, [loading])

    /**
     * 监听到数组里面有值的话则取第一个为默认数据，依次默认数据来渲染表格
     */
    useEffect(() => {
        setMp(mpList[0])
        setPollutant(pollutantList[0])
    }, [mpList, pollutantList])

    /**
     * 监听一下按钮的变化，然后获取对应的班次数据
     */
    useEffect(() => {
        if (mp && pollutant) {
            setShiftObj(handleGetShiftObj(mp.mpId, pollutant.code))
            setGroupObj(handleGetGroupObj(mp.mpId, pollutant.code))
        }
    }, [mp, pollutant])

    return (
        <div className={styles.wrap}>
            {mp && pollutant &&
                <table border={1} cellSpacing={0}>
                    <tbody>
                        <tr>
                            <td className={styles.td1} colSpan={5}>小时排放预测（{mp?.mpName}）</td>
                        </tr>
                        <tr>
                            <td className={styles.td2} style={{ fontSize: '15px' }} colSpan={2} rowSpan={5}>{ }
                                {shiftObject === null ? '暂无数据' : handleParseShiftAvg() &&
                                    (handleParseShiftAvg() as [string, number][]).map(([key, value]) => (
                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div style={{ marginLeft: '30px', fontVariantNumeric: 'tabular-nums' }}>{key}时</div>
                                            <div style={{ fontVariantNumeric: 'tabular-nums' }}>{value}</div>
                                            <div style={{ marginRight: '30px', fontVariantNumeric: 'tabular-nums' }}>mg/m³</div>
                                        </div>
                                    ))
                                }
                            </td>
                            <td className={styles.td3} colSpan={2} rowSpan={5} style={{ whiteSpace: 'pre-line' }}>
                                剩余时间内，若平均氧含量，实测浓度实时均值，预测当前小时排放浓度将达标/超标。
                                <br></br>
                                <br></br>
                                <br></br>
                                当前小时折算浓度均值为，建议控制氧含量在情况下时，保持实测浓度实时均值在以下。
                            </td>
                            <td className={styles.td4}>今日班组排放均值</td>
                        </tr>
                        <tr>
                            <td className={styles.td5} >{GroupIdList[0]}{'组值\n'}{handleGetGroupValue("1")} mg/m³</td>
                        </tr>
                        <tr>
                            <td className={styles.td5} >{GroupIdList[1]}{'组值\n'}{handleGetGroupValue("2")} mg/m³</td>
                        </tr>
                        <tr>
                            <td className={styles.td5}>{GroupIdList[2]}{'组值\n'}{handleGetGroupValue("3")} mg/m³</td>
                        </tr>
                        <tr>
                            <td className={styles.td5}>{GroupIdList[3]}{'组值\n'}{handleGetGroupValue("4")} mg/m³</td>
                        </tr>
                        <tr>
                            <td className={styles.td6}>剩余分钟数min</td>
                            <td className={styles.td6}>控制含氧量%</td>
                            <td className={styles.td7}>剩余实测浓度%</td>
                            <td className={styles.td7}>当前折算均值mg/m³</td>
                            <td className={styles.td8}>本小时排放预测</td>
                        </tr>
                        <tr>
                            <td className={styles.td6} style={{ fontSize: '20px' }}>{60 - new Date().getMinutes()} min</td>
                            <td className={styles.td6} style={{ fontSize: '20px' }}>{mp.o2StandardAvg}</td>
                            <td className={styles.td7}>第八行，第三列</td>
                            <td className={styles.td7}>第八行，第四列</td>
                            <td className={styles.td8}>第八行，第五列</td>
                        </tr>
                    </tbody>
                </table>
            }

            <div style={{ marginTop: '11px', flex: '1' }}>
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


            <div className={styles.updateButton}>
                <Button type="primary" onClick={() => handleResetData()} loading={buttonLoading}>更新数据</Button>
            </div>

        </div >
    );
};

export default DataBoard;
