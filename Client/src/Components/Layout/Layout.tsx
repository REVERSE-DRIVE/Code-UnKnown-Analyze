import { Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import style from './layout.module.css';
import User from '../User/User';
import Exception from '../Exception/Exception';

export default function Layout() {
    return <div className={style.screen}>
        <Header />
        
        <article>
            <Sidebar />
            <Routes>
                <Route path='/user' element={<User />}></Route>
                <Route path='/exceptions' element={<Exception />}></Route>
            </Routes>
        </article>
    </div>;
}