import { useEffect, useMemo, useState } from 'react';
import style from './exception.module.css';
import { request } from '../Util/request';
import { useNavigate } from 'react-router-dom';
import { numberComma } from '../Util/misc';

interface exceptionData {
    type: string,
    count: number
}

export default function Exception() {
    const [ option, setOption ] = useState(0);
    const [ list, setList ] = useState<exceptionData[]>([]);
    const total = useMemo(() => list.length === 0 ? 0 : list.map(v => Number(v.count)).reduce((a, v) => a + v), [ list ]);

    const loadData = async function() {
        const { code, data }: { code: number, data: exceptionData[] } = await request(`exception?time=${option}`);
        if (code !== 200) return;

        data.map(v => ({ type: v.type, count: Number(v.count) }));
        data.sort((a, b) => {
            if (a.count < b.count)
                return -1;
            else if (a.count > b.count)
                return 1;
            else return 0;
        });
        setList(data);
    }

    useEffect(() => {
        loadData();
    }, [ option ]);

    return <main className={style.main}>
        <Head title='오류 기록' setState={setOption} />

        {/* Table Head */}
        <section className={style.table_head}>
            <div>타입</div>
            <div>비중</div>
            <div>횟수</div>
        </section>

        {/* List */}
        <section className={style.list}>
            {list.map(v => <Box key={v.type} data={v} total={total} />)}
        </section>
    </main>;
}

export function Head({ title, setState }: { title: string, setState: React.Dispatch<React.SetStateAction<number>> }) {
    return <section className={style.head}>
        <h2>{title}</h2>
        
        <select onChange={e => setState(Number(e.target.value))} className={style.time_option}>
            <option value="0">이전 24시간</option>
            <option value="1">이전 7일</option>
            <option value="2">이전 30일</option>
        </select>
    </section>;
}

function Box({ data, total }: { data: exceptionData, total: number }) {
    const navigate = useNavigate();

    return <div onClick={() => navigate(`/exceptions/${data.type}`)} className={style.box}>
        <div>{data.type}</div>
        <div>
            <ProgressBar value={(data.count / total) * 100} />
        </div>
        <div>{numberComma(data.count)}</div>
    </div>;
}

export function ProgressBar({ value }: { value: number }) {
    return <div className={style.bar_main}>
        <div className={style.bar_in} style={{ width: `${value}%` }}></div>
    </div>
}