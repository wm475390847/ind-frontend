import { Button, message } from "antd";
import React, { useEffect, useState } from "react";
import styles from './index.module.less'
import { getMpList, getPollutantList, getAvgData, execute } from "@/services";
import { GroupIdList } from "@/constants";

const DataBoard: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [buttonLoading, setButtongLoading] = useState(false)

    const [groupHourAvgList, setGroupHourAvgList] = useState<GroupHourAvg[]>([])
    const [shiftHourAvgList, setShiftHourAvgList] = useState<ShiftHourAvg[]>([])
    const [pollutantRealtimeAvgList, setPollutantRealtimeAvgList] = useState<PollutantRealtimeAvg[]>([])
    const [O2RealtimeAvgList, setO2RealtimeAvgList] = useState<O2RealtimeAvg[]>([])

    const [shiftObj, setShiftObj] = useState<any>()
    const [groupObj, setGroupObj] = useState<any>()
    const [pollutantRealtimeAvg, setPollutantRealtimeAvg] = useState<number>()
    const [o2RealtimeAvg, setO2RealtimeAvg] = useState<number>()
    // 折算值
    const [zs, setZs] = useState<number>()
    // 剩余折算
    const [syzs, setSyzs] = useState<number>()
    // 预测排放
    const [ycpf, setYcpf] = useState<number>()
    // 剩余实测
    const [sysc, setSysc] = useState<number>()

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
     * 计算剩余实测
     * @param o2Standard 氧含量标量
     * @param syzs 剩余折算 
     */
    const handleGetSysc = (o2Standard: number, syzs: number) => {
        const value = syzs / ((21 - 11) / (21 - o2Standard))
        return Math.round(value * 1000) / 1000
    }

    /**
     * 计算剩余折算
     * @param pollutantStandard  污染物标量
     * @param ycpf 预测排放
     * @returns 
     */
    const handleGetSyzs = (pollutantStandard: number, ycpf: number) => {
        const min = new Date().getMinutes()
        const value = ycpf && ((60 * pollutantStandard) - (min * ycpf)) / (60 - min)
        return Math.round(value * 1000) / 1000
    }

    /**
     * 计算折算系数
     * @returns 
     */
    const handleGetZs = (pollutantRealtimeAvg: number) => {
        const value = pollutantRealtimeAvg && (21 - 11) / (21 - pollutantRealtimeAvg)
        return Math.round(value * 1000) / 1000
    }

    /**
     * 获取污染物实时均值
     * @param mpId 排放口id
     * @param pollutantCode 污染物编码 
     * @returns 
     */
    const handleGetPollutantRealtimeAvg = (mpId: string, pollutantCode: string) => {
        const targetObj = pollutantRealtimeAvgList.find(item => item.mpId === mpId)
        if (targetObj) {
            const valueObj = targetObj.value as { [key: string]: any };
            // 检查 valueObj 中是否包含指定的 pollutant 属性
            if (pollutantCode in valueObj) {
                return valueObj[pollutantCode];
            }
        }
    }

    /**
     * 获取实时氧含量均值
     * @param mpId 排放口id
     * @returns 
     */
    const handleGetO2RealtimeAvg = (mpId: string) => {
        const { value } = O2RealtimeAvgList.find(item => item.mpId === mpId) || {};
        return value;

    }

    /**
     * 获取班次数据值
     * @param mpId 排放口id
     * @param pollutantCode 污染物编码 
     * @returns 
     */
    const handleGetShiftObj = (mpId: string, pollutantCode: string) => {
        // 根据 mpId 查找目标对象
        const targetObj = shiftHourAvgList.find(item => item.mpId === mpId);
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
        const targetObj = groupHourAvgList.find(item => item.mpId === mpId);
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
        return groupObj && groupObj[groupId] || 0;
    }

    /**
     * 处理当前班次均值，排序
     * @returns 排放均值
     */
    const handleParseShiftAvg = () => {
        if (shiftObj) {
            const entries = Object.entries(shiftObj); // 获取所有属性键值对
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
                setGroupHourAvgList(res.data.groupHourAvg)
                setShiftHourAvgList(res.data.shiftHourAvg)
                setPollutantRealtimeAvgList(res.data.pollutantRealtimeAvg)
                setO2RealtimeAvgList(res.data.o2RealtimeAvg)
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
            const mpId = mp.mpId
            const pollutantCode = pollutant.code
            setShiftObj(handleGetShiftObj(mpId, pollutantCode))
            setGroupObj(handleGetGroupObj(mpId, pollutantCode))
            const pollutantRealtimeAvg = handleGetPollutantRealtimeAvg(mpId, pollutantCode)
            setPollutantRealtimeAvg(pollutantRealtimeAvg)
            const o2RealtimeAvg = handleGetO2RealtimeAvg(mpId)
            setO2RealtimeAvg(o2RealtimeAvg)
            // 折算系数
            const zs = handleGetZs(pollutantRealtimeAvg)
            setZs(zs)
            // 预测排放
            const ycpf = Math.round(zs * pollutantRealtimeAvg * 1000) / 1000
            setYcpf(ycpf)
            // 剩余折算
            const syzs = handleGetSyzs(Number(pollutant.code), ycpf)
            setSyzs(syzs)
            // 剩余实测
            const sysc = handleGetSysc(Number(mp.o2StandardAvg), syzs)
            setSysc(sysc)
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
                                {shiftObj === null ? '暂无数据' : handleParseShiftAvg() &&
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
                                {`剩余时间内，若平均氧含量，实测浓度实时均值，预测当前小时排放浓度将达标/超标。

                                实时氧含量平均值：${o2RealtimeAvg}
                                实时污染物含量平均值：${pollutantRealtimeAvg}
                                当前折算系数：${zs}
                                该小时预测排放值：${ycpf}
                                剩余折算值：${syzs}
                                剩余实测值：${sysc}
                               
                                当前小时折算浓度均值为，建议控制氧含量在情况下时，保持实测浓度实时均值在以下。`}
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
                            <td className={styles.td6}>控制氧含量%</td>
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
