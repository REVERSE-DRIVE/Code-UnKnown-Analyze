import { Route, Routes } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import style from './layout.module.css';
import User from '../User/User';
import Exception from '../Exception/Exception';
import ExceptionDetail from '../Exception/ExceptionDetail';
import Scene from '../Scene/Scene';

export default function Layout() {
    return <div className={style.screen}>
        <Header />
        
        <article>
            <Sidebar />
            <Routes>
                <Route path='/user' element={<User />}></Route>
                <Route path='/exceptions' element={<Exception />}></Route>
                <Route path='/exceptions/:type' element={<ExceptionDetail />}></Route>
                <Route path='/scenes' element={<Scene />}></Route>
            </Routes>
        </article>
    </div>;
}