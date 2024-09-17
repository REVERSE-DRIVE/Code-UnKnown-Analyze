import { useEffect, useState } from 'react';
import { ProgressBar } from '../Exception/Exception';
import { TimeOption, TimeSelect } from '../Recycle/TimeSelect';
import style from './interaction.module.css';
import { request } from '../Util/request';
import { numberComma } from '../Util/misc';

export default function InteractionPage() {
    return <main className={style.main}>
        <section className={style.row}>
            <CountSection id='button' title='버튼' />
            
            <div className={style.line}></div>
            
            <CountSection id='skill' title='스킬' />
        </section>

        {/* 카드 업글 얼마나 골랐는지 */}
        <section className={style.row}>
            <CardCountBox />

            <div className={style.line}></div>
            
            <EmptyBox />
        </section>
    </main>;
}

interface InteractionItem {
    id: string,
    count: number,
    access: number
}
interface InteractionItemBox extends InteractionItem {
    count_precent: number
}

type InteractionApi = {
    total: number,
    data: InteractionItem[]
}

function CountSection({ id, title }: { id: string, title: string }) {
    const [date, setDate] = useState<TimeOption>(TimeOption.Last24);
    const [list, setList] = useState<InteractionItemBox[]>([]);
    
    useEffect(() => {
        let control = true;

        const getData = async function() {
            const { code, data: _data } = await request(`interaction/${id}?time=${date}`);
            if (!control || code !== 200) return;

            const data = _data as InteractionApi;
            const totalCount = data.data.reduce((prev, current) => prev + Number(current.count), 0);
            const result: InteractionItemBox[] = [];

            data.data.forEach(v => {
                result.push({
                    id: v.id,
                    count: Number(v.count),
                    access: (Number(v.access) / data.total) * 100,
                    count_precent: (Number(v.count) / totalCount) * 100
                });
            });

            result.sort((a, b) => a.count + b.count);

            setList(result);
        }
        getData();

        return () => { control = false };
    }, [date]);

    return <section className={[style.box, style.skill_count].join(' ')}>
        <div className={style.head}>
            <h2>{title} 사용 현황</h2>
            <TimeSelect setState={setDate} />
        </div>

        <div className={style.table_head}>
            <div>이름</div>
            <div>접근</div>
            <div>횟수</div>
        </div>
    
        <section className={style.list}>
            
            {list.map(v => <div key={v.id} className={style.box}>
                <div>{v.id}</div>
                <div><span>{v.access}%</span><ProgressBar value={v.access} className={[style.bar]} /></div>
                <div><span>{numberComma(v.count)}</span><ProgressBar value={v.count_precent} className={[style.bar]} /></div>
            </div>)}
        </section>
    </section>;
}

function CardCountBox() {
    const [_, setDate] = useState<TimeOption>(TimeOption.Last24);
    return <section className={[style.box, style.card_count].join(' ')}>
        <div className={style.head}>
            <h2>카드 사용 현황</h2>
            <TimeSelect setState={setDate} />
        </div>


    </section>;
}

function EmptyBox() {
    return <section className={[style.box, style.empty_count].join(' ')}>
        <span>나중에 뭐 넣을지 추천좀</span>
    </section>;
}