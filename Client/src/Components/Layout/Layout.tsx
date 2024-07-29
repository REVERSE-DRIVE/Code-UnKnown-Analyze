import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import style from './layout.module.css';

export default function Layout() {
    return <div className={style.screen}>
        <Header />
        
        <article>
            <Sidebar />
        </article>
    </div>;
}