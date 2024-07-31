import { useEffect, useState } from 'react';
import { ProgressBar } from '../Exception/Exception';
import style from './scene.module.css';
import { request } from '../Util/request';
import { secondsToString } from '../Util/misc';

interface sceneAPI {
    list: { [key: string]: { count: number, avg: number } },
    total: number
}

export default function Scene() {
    const [ lowTop, setLowTop ] = useState({ low: '--', top: '--' });
    const [ data, setData ] = useState<sceneAPI>();
    
    const loadData = async function() {
        const { code, data: _data } = await request('scene');
        const data = _data as sceneAPI;

        if (code !== 200) return;
        
        const firstScene = Object.keys(data.list)[0];
        
        if (firstScene) {
            let min = firstScene, max = firstScene;
            
            Object.keys(data.list).forEach(v => {
                if (data.list[min].count > data.list[v].count) {
                    min = v;
                }
                if (data.list[max].count < data.list[v].count) {
                    max = v;
                }
            });

            setLowTop({ low: min, top: max });
        }

        setData(data);
    }
    
    useEffect(() => {
        loadData();
    }, []);

    return <main className={style.main}>
        <h1>Scene 현황</h1>

        <h2 className={style.many}>많이 접근한 Scene은 <span>{lowTop.top}</span> 입니다.</h2>
        <h2 className={style.low}>적게 접근한 Scene은 <span>{lowTop.low}</span> 입니다.</h2>

        <SceneList data={data} />
    </main>;
}

type sceneData = {
    name: string,
    time: number,
    count: number,
    percent: number
}

enum sortType {
    High,
    Low,
    TimeHigh,
    TimeLow
}

function SceneList({ data }: { data?: sceneAPI }) {
    const [ list, setList ] = useState<sceneData[]>([]);
    const [ sort, setSort ] = useState<sortType>(sortType.High);

    const listSort = function(array: sceneData[]) {
        array.sort(function(a, b) {
            switch (sort) {
                case sortType.High:

                    if (a.count < b.count) return 1;
                    else if (a.count > b.count) return -1;
                    else return 0;

                case sortType.Low:

                    if (a.count < b.count) return -1;
                    else if (a.count > b.count) return 1;
                    else return 0;

                case sortType.TimeHigh:
                    
                    if (a.time < b.time) return 1;
                    else if (a.time > b.time) return -1;
                    else return 0;

                case sortType.TimeLow:
                    if (a.time < b.time) return -1;
                    else if (a.time > b.time) return 1;
                    else return 0;

                default:
                    return 0;
            }
        });
    }

    const sortChange = function(e: React.ChangeEvent<HTMLSelectElement>) {
        setSort(Number(e.currentTarget.value));
    }

    useEffect(() => {
        if (!data) return;

        const scenes: sceneData[] = [];
        Object.keys(data.list).forEach(v => {
            const value = data.list[v];

            scenes.push({
                name: v,
                count: value.count,
                time: Math.floor(value.avg),
                percent: Math.floor((value.count / data.total) * 100)
            });
        });

        listSort(scenes);
        setList(scenes);
    }, [data]);

    useEffect(() => {
        listSort(list);
        setList([...list]);
    }, [sort]);

    return <section className={style.scene_list}>
        <div className={style.head}>
            <span>Scene 리스트</span>
            <select onChange={sortChange}>
                <option value="0">높은 순</option>
                <option value="1">낮은 순</option>
                <option value="2">시간 높은 순</option>
                <option value="3">시간 낮은 순</option>
            </select>
        </div>

        {list.map(v => <SceneBox key={v.name} data={v} />)}
    </section>;
}

function SceneBox({ data }: { data: sceneData }) {
    return <div className={style.box}>
        <div>{data.name}</div>
        <div>{secondsToString(data.time)}</div>
        <div><ProgressBar value={data.percent} /> {data.percent}%</div>
    </div>;
}