import style from './interaction.module.css';

export default function InteractionPage() {
    return <main className={style.main}>
        <section className={style.row}>
            <ButtonCountBox />
            
            <div className={style.line}></div>
            
            <SkillCountBox />
        </section>
    </main>;
}

function ButtonCountBox() {
    return <section className={style.box}>
        <h2>버튼 사용 현황</h2>
        
        <section className={style.list}>
            
        </section>
    </section>;
}

function SkillCountBox() {
    return <section className={style.box}>
        <h2>스킬 사용 현황</h2>
    
        <section className={style.list}>

        </section>
    </section>;
}

