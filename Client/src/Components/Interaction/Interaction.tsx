import { ProgressBar } from '../Exception/Exception';
import { TimeSelect } from '../Recycle/TimeSelect';
import style from './interaction.module.css';

export default function InteractionPage() {
    return <main className={style.main}>
        <section className={style.row}>
            <ButtonCountBox />
            
            <div className={style.line}></div>
            
            <SkillCountBox />
        </section>

        {/* 카드 업글 얼마나 골랐는지 */}
        <section className={style.row}>
            <CardCountBox />

            <div className={style.line}></div>
            
            <EmptyBox />
        </section>
    </main>;
}

function ButtonCountBox() {
    return <section className={[style.box, style.btn_count].join(' ')}>
        <div className={style.head}>
            <h2>버튼 사용 현황</h2>
            <TimeSelect />
        </div>

        <div className={style.table_head}>
            <div>이름</div>
            <div>접근</div>
            <div>횟수</div>
        </div>
        
        <section className={style.list}>
            
            <div className={style.box}>
                <div>testBtn</div>
                <div><span>60%</span><ProgressBar value={60} className={[style.bar]} /></div>
                <div><span>1,234</span><ProgressBar value={55} className={[style.bar]} /></div>
            </div>
        
        </section>
    </section>;
}

function SkillCountBox() {
    return <section className={[style.box, style.skill_count].join(' ')}>
        <div className={style.head}>
            <h2>스킬 사용 현황</h2>
            <TimeSelect />
        </div>

        <div className={style.table_head}>
            <div>이름</div>
            <div>접근</div>
            <div>횟수</div>
        </div>
    
        <section className={style.list}>
            
            <div className={style.box}>
                <div>testBtn</div>
                <div><span>60%</span><ProgressBar value={60} className={[style.bar]} /></div>
                <div><span>1,234</span><ProgressBar value={55} className={[style.bar]} /></div>
            </div>
            <div className={style.box}>
                <div>testBtn</div>
                <div><span>60%</span><ProgressBar value={60} className={[style.bar]} /></div>
                <div><span>1,234</span><ProgressBar value={55} className={[style.bar]} /></div>
            </div>

        </section>
    </section>;
}

function CardCountBox() {
    return <section className={[style.box, style.card_count].join(' ')}>
        <div className={style.head}>
            <h2>카드 사용 현황</h2>
            <TimeSelect />
        </div>


    </section>;
}

function EmptyBox() {
    return <section className={[style.box, style.empty_count].join(' ')}>
        <span>나중에 뭐 넣을지 추천좀</span>
    </section>;
}