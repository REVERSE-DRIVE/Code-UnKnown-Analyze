import style from './login.module.css';

import logo from '../../Assets/logo.png';

export default function Login() {
    return <main className={style.main}>
        <LoginBox />
        
        <img src={logo} className={style.logo} />
    </main>;
}

function LoginBox() {
    return <article className={style.box}>
        <h2>로그인</h2>

        <Input title="아이디" type='text' />
        <Input title='비밀번호' type='password' />

        <div className={style.error}></div>

        <button className={style.login_btn}>로그인</button>
    
        <Footer />
    </article>
}

function Input({ title, type }: { title: string, type: React.HTMLInputTypeAttribute }) {
    return <section className={style.input_box}>
        <div className={style.title}>{title}</div>
        <input type={type} />
    </section>;
}

function Footer() {
    return <section className={style.footer}>
        <div>Client IP Address <span>0.0.0.0</span></div>
        <div>문의는 discord: domi_0</div>
    </section>;
}