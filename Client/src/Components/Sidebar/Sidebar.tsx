import style from './sidebar.module.css';

import dashboardSvg from './dashboard.svg';
import userSvg from './user.svg';
import errorSvg from './error.svg';
import unitySvg from './unity.svg';
import timeSvg from './time.svg';
import { useNavigate } from 'react-router-dom';

const MENUS = [
    ['dashboard', dashboardSvg, '대시보드'],
    ['user', userSvg, '유저 현황'],
    ['exceptions', errorSvg, '오류 기록'],
    ['scenes', unitySvg, 'Scene 현황'],
    ['playtime', timeSvg, '플레이 타임'],
    ['interaction', timeSvg, '상호 작용'],
]

export default function Sidebar() {
    const navigate = useNavigate();
    const goPage = (page: string) => navigate(`/code_unknown/admin/${page}`);

    return <aside className={style.main}>
        {MENUS.map(v => {
            let active = false;
            if (v[0] === "") {
                active = new RegExp("^/code_unknown/admin/?$").test(location.pathname);
            } else {
                active = new RegExp(`^/code_unknown/admin/${v[0]}/?`).test(location.pathname);
            }
        
            return <button key={v[0]} onClick={() => goPage(v[0])} className={[style.box, (active ? style.active : '')].join(' ')}>
                <img src={v[1]} />
                {v[2]}
            </button>
        })}
    </aside>;
}