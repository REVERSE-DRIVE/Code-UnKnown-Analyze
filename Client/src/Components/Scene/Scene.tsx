import { ProgressBar } from '../Exception/Exception';
import style from './scene.module.css';

export default function Scene() {
    return <main className={style.main}>
        <h1>Scene 현황</h1>

        <h2 className={style.many}>많이 접근한 Scene은 <span>domiMAP</span> 입니다.</h2>
        <h2 className={style.low}>적게 접근한 Scene은 <span>main</span> 입니다.</h2>

        <SceneList />
    </main>;
}

function SceneList() {
    return <section className={style.scene_list}>
        <div className={style.head}>
            <span>Scene 리스트</span>
            <select name="" id="">
                <option value="">높은 순</option>
                <option value="">낮은 순</option>
                <option value="">시간 높은 순</option>
                <option value="">시간 낮은 순</option>
            </select>
        </div>

        <SceneBox />
        <SceneBox />
        <SceneBox />
    </section>;
}

function SceneBox() {
    return <div className={style.box}>
        <div>domiMAP</div>
        <div>35분</div>
        <div><ProgressBar value={70} /> 70%</div>
    </div>;
}