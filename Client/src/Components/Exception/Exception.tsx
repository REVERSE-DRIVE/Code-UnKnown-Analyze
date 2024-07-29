import style from './exception.module.css';

export default function Exception() {
    return <main className={style.main}>
        <Head />

        {/* Table Head */}
        <section className={style.table_head}>
            <div>타입</div>
            <div>비중</div>
            <div>횟수</div>
        </section>

        {/* List */}
        <section className={style.list}>
            <Box />
            <Box />
            <Box />
            <Box />
            <Box />
        </section>
    </main>;
}

function Head() {
    return <section className={style.head}>
        <h2>오류 기록</h2>
        
        <select className={style.time_option}>
            <option value="">이전 24시간</option>
            <option value="">이전 7일</option>
            <option value="">이전 30일</option>
        </select>
    </section>;
}

function Box() {
    return <div className={style.box}>
        <div>System.NullReferenceException</div>
        <div>
            <Bar value={50} />
        </div>
        <div>10</div>
    </div>;
}

function Bar({ value }: { value: number }) {
    return <div className={style.bar_main}>
        <div className={style.bar_in} style={{ width: `${value}%` }}></div>
    </div>
}