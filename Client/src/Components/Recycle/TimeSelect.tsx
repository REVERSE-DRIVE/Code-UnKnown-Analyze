import style from './recycle.module.css';

export enum TimeOption {
    Last24 = 0,
    Last7Day,
    Last30Day
}

export function TimeSelect() {
    return <select className={style.time_select}>
        <option value="0">이전 24시간</option>
        <option value="1">이전 7일</option>
        <option value="2">이전 30일</option>
    </select>;
}