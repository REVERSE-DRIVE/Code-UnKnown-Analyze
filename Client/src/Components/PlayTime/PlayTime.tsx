import { Bar } from 'react-chartjs-2';
import style from './playtime.module.css';
import { testValues } from '../User/User';
import { TimeSelect } from '../Recycle/TimeSelect';
import { useEffect, useState } from 'react';
import { request } from '../Util/request';
import { getRandomInt, secondsToString, stringToHash } from '../Util/misc';

export function PlayTime() {
    const [ playtime, setPlaytime ] = useState<number>(0);

    return <main className={style.main}>
        <h1 className={style.title}>플레이 타임</h1>
        <div className={style.sub_title}>오늘 평균 플레이 타임은 <span>{secondsToString(playtime)}</span> 입니다.</div>
        
        <GamePlayChart setPlaytime={setPlaytime} />
        <SceneTimeChart />
        <SceneTimeList />
    </main>;
}

type gameChartData = { name: string, value: number };
interface gameChartAPI {
    result: {
        time: number, // 서버에서는 string으로 주기 때문에 변환 해야함
        created: string
    }[],
    server_time: string
}

function GamePlayChart({ setPlaytime }: { setPlaytime: React.Dispatch<React.SetStateAction<number>> }) {
    const [list, setList] = useState<gameChartData[]>([]);

    const data = {
        labels: list.map(v => v.name),
        datasets: [
            {
                // label: "최근 접속",
                data: list.map(v => v.value),
                // borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            }
        ],
    }

    const options = {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            intersect: false,
            callbacks: {
                label: (tooltipItem: any) => secondsToString(Number(tooltipItem.formattedValue.replaceAll(',', '')))
            }
          }
        },
        scales: {
            y: {
              ticks: {
                callback: (_label: any) => secondsToString(_label)
              }
            }
        },
        responsive: true,
        maintainAspectRatio: false,
    }

    const loadData = async function() {
        const { code, data: _data } = await request('time/ingame_chart');
        const data = _data as gameChartAPI;
        
        if (code !== 200) return;

        const result_index: { [key: string]: number } = {};
        const result: gameChartData[] = [];

        data.result.forEach(v => {
            const time = new Date(v.created);
            result_index[`${time.getMonth()}${time.getDate()}`] = Number(v.time);
        });

        for (let i = 30; i >= 0; i--) {
            const time = new Date(data.server_time);
            time.setDate(time.getDate() - i);
            
            const value = result_index[`${time.getMonth()}${time.getDate()}`] || 0;
            
            result.push({
                name: `${time.getMonth() + 1}월 ${time.getDate()}일`,
                value: value
            });

            if (i === 0)// 오늘
                setPlaytime(value);
        }

        setList(result);
    }

    useEffect(() => {
        loadData();
    }, []);

    return <section className={style.gameplay_box}>
        <Bar options={options} data={data} />
    </section>;
}

interface sceneChartAPI {
    result: {
        scene: string,
        time: number,
        created: string
    }[],
    server_time: string
}
function SceneTimeChart() {
    const [label, setLabel] = useState<string[]>([]);
    const [dataset, setDataset] = useState<{ label: string, data: number[], backgroundColor: string }[]>([]);

    const data = {
        labels: label,
        datasets: dataset,
    }

    const options = {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            intersect: false,
            callbacks: {
                label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${secondsToString(Number(tooltipItem.formattedValue.replaceAll(',', '')))}`
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              ticks: {
                callback: (_label: any) => secondsToString(_label)
              }
            }
        }
    }

    const loadData = async function() {
        const { code, data: _data } = await request('time/scene_chart');
        const data = _data as sceneChartAPI;

        if (code !== 200) return;

        const serverTime = new Date(data.server_time);
        const result: { [key: string]: { data: number[], backgroundColor: string } } = {};

        data.result.forEach(v => {
            const diffDay = new Date(serverTime.getTime() - new Date(v.created).getTime()).getDate() - 1;
            
            let yData = result[v.scene];
            if (yData === undefined) {
                const hash = String(stringToHash(v.scene));
                result[v.scene] = yData = {
                    data: [],
                    // backgroundColor: `rgba(${hash.slice(0, 3) || 0}, ${hash.slice(3, 6) || 0}, ${hash.slice(6, 9) || 0}, 0.7)`
                    backgroundColor: `rgba(${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, ${getRandomInt(0, 255)}, 0.7)`
                }
            }

            yData.data[diffDay] = v.time;
        });

        const labels: string[] = [];
        for (let i = 30; i >= 0; i--) {
            const time = new Date(data.server_time);
            time.setDate(time.getDate() - i);
            
            labels.push(`${time.getMonth() + 1}월 ${time.getDate()}일`);
        }

        setLabel(labels);
        setDataset(Object.keys(result).map(scene => {
            const value = result[scene];

            return {
                label: scene,
                ...value
            };
        }));
    }

    useEffect(() => {
        loadData();
    }, []);

    return <section className={style.scenetime_chart}>
        <h2>Scene 시간</h2>

        <div className={style.chart_container}>
            <Bar options={options} data={data} />
        </div>
    </section>
}

function SceneTimeList() {
    return <section className={style.scenetime_list}>
        <div className={style.header}>
            <h2>Scene 시간 목록</h2>
            <TimeSelect />
        </div>

        <div className={style.table_head}>
            <div>Scene</div>
            <div>평균 플레이 시간</div>
        </div>

        <SceneTime />
        <SceneTime />
        <SceneTime />
    </section>;
}

function SceneTime() {
    return <div className={style.box}>
        <div>domiMAP</div>
        <div>10시 10분 10초</div>
    </div>;
}