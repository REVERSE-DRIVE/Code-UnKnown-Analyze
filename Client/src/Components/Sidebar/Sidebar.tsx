import style from './sidebar.module.css';

import dashboardSvg from './dashboard.svg';
import userSvg from './user.svg';
import errorSvg from './error.svg';
import unitySvg from './unity.svg';

const MENUS = [
    ['dashboard', dashboardSvg, '대시보드'],
    ['users', userSvg, '유저 현황'],
    ['exception', errorSvg, '오류 기록'],
    ['scenes', unitySvg, 'Scene 현황'],
]

export default function Sidebar() {
    return <aside className={style.main}>
        {MENUS.map(v => <button key={v[0]} className={style.box}>
            <img src={v[1]} />
            {v[2]}
        </button>)}
    </aside>;
}