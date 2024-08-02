import style from './exception_detail.module.css';
import { Head, ProgressBar } from './Exception';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,  ChartData, CategoryScale, LinearScale, PointElement, Filler, Tooltip, BarElement } from 'chart.js';
import { testValues } from '../User/User';

import arrowSvg from './right_arrow.svg';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { request } from '../Util/request';
import { numberComma } from '../Util/misc';
import React from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Filler, Tooltip);

export default function ExceptionDetail() {
    const { type: errorType } = useParams();
    const [ option, setOption ] = useState(0);

    if (errorType === undefined) return;

    return <main className={style.main}>
        <Head title={`오류 타입: ${errorType}`} setState={setOption} />
    
        <ChartBox type={errorType} />

        <h2>상세 정보</h2>
        <TableHead />

        <TableContent type={errorType} option={option} />
    </main>;
}

type chartData = {
    count: number,
    time: string
}

type saveChartData = { count: number, displayName: string }

function ChartBox({ type }: { type: string }) {
    const [ counts, setCounts ] = useState<saveChartData[]>([]);

    const data: ChartData = {
        labels: counts.map(v => v.displayName),
        datasets: [
            {
                // label: "최근 접속",
                data: counts.map(v => v.count),
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
          }
        },
        responsive: true,
        maintainAspectRatio: false,
    }

    const loadData = async function() {
        const { code, data: _data } = await request(`exception/${type}/chart`);
        const data = _data as chartData[];

        if (code !== 200) return;

        const indexing: { [key: string]: number } = {};
        data.forEach(e => {
            const time = new Date(e.time);
            indexing[`${time.getFullYear()}${time.getMonth()}${time.getDate()}`] = Number(e.count);
        });
        
        const date = new Date();
        const result: saveChartData[] = [];
        for (let i = 0; i <= 30; i++) {
            result.push({
                displayName: `${date.getMonth() + 1}월 ${date.getDate()}일`,
                count: indexing[`${date.getFullYear()}${date.getMonth()}${date.getDate()}`] || 0
            });
            date.setDate(date.getDate() - 1);
        }

        result.reverse();
        setCounts(result);
    }

    useEffect(() => {
        loadData();
    }, [type]);

    return <section className={style.chart_box}>
        <h2>개요</h2>

        <div className={style.chart_container}>
            <Bar options={options} data={data} />
        </div>
    </section>;
}

function TableHead() {
    return <section className={style.tb_head}>
        <div></div>
        <div>함수 / Line</div>
        <div>비중</div>
        <div>횟수</div>
    </section>
}

type exceptionFunction = {
    func: string,
    count: number
}

type exceptionMessage = {
    message: string,
    count: number,
}

type messageStateType = { [key: string]: { hide: boolean, content: exceptionMessage[] } | null | undefined };

function TableContent({ type, option }: { type: string, option: number }) {
    const [ list, setList ] = useState<exceptionFunction[]>([]);
    const [ messages, setMessages ] = useState<messageStateType>({});
    // const statusRef = useRef<{ [key: string]: boolean }>({});

    const total = useMemo(() => list.length > 0 ? list.map(v => v.count).reduce((prev, v) => prev + v) : 0, [ list ]);

    const loadList = async function() {
        const { code, data: _data } = await request(`exception/${type}?time=${option}`);
        let data = _data as exceptionFunction[];

        if (code !== 200) return;

        data = data.map(v => ({ func: v.func, count: Number(v.count) }));
        data.sort(function(a, b) {
            if (a.count < b.count) return 1;
            else if (a.count > b.count) return -1;
            return 0;
        });

        setList(data);
    }

    const loadMessage = async function(name: string) {
        const data = messages[name];
        if (data === null) return; // 로딩중이라 머 못함
        
        if (data !== undefined) {
            data.hide = !data.hide;
            setMessages({ ...messages });
            return;
        }

        setMessages({ ...messages, [name]: null });

        const { code, data: result } = await request(`exception/${type}/${name}/messages?time=${option}`);
        if (code !== 200) return;
        
        setMessages((prev: messageStateType) => ({ ...prev, [name]: {
            hide: false,
            content: result
        } }));
    }


    useEffect(() => {
        setList([]);
        setMessages({});
        // statusRef.current = {};

        loadList();
    }, [ type, option ]);

    return <section className={style.list}>
        {list.map(v => {
            const open = messages[v.func] === null || messages[v.func]?.hide === false;

            return <React.Fragment key={v.func}>
                <Box onToggle={() => loadMessage(v.func)} toggle={open} data={v} total={total} />
                {open && messages[v.func]?.content.map(v => <DetailBox key={v.message} data={v} />)}
            </React.Fragment>;
        })}
    </section>;
}

function Box({ data, total, toggle, onToggle }: { data: exceptionFunction, total: number, toggle: boolean, onToggle: () => void }) {
    return <div onClick={onToggle} className={style.box}>
        <div><img style={toggle ? {transform: 'rotate(90deg)'} : {}} src={arrowSvg} /></div>
        <div>{data.func}</div>
        <div><ProgressBar value={(data.count / total) * 100} /></div>
        <div>{numberComma(data.count)}</div>
    </div>;
}

function DetailBox({data}: {data: exceptionMessage}) {
    return <div className={style.detail_box}>
        <div className={style.message}>
            <h3>메세지</h3>
            <pre>{data.message}</pre>
        </div>

        <div className={style.count}>{numberComma(data.count)}</div>
    </div>
}