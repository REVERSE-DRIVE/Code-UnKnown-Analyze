import { Line, Pie } from 'react-chartjs-2';
import style from './user.module.css';
import { ArcElement, Filler, Tooltip } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
import { useEffect, useState } from 'react';
import { request } from '../Util/request';
  
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

export const testValues = [
    [27, 30, 12],
    [28, 50, 35],
    [29, 10, 5],
    [30, 20, 3],
    [31, 25, 8],
    [32, 60, 42],
    [33, 15, 7],
    [34, 35, 18],
    [35, 45, 20],
    [36, 50, 22],
    [37, 55, 25],
    [38, 65, 30],
    [39, 70, 32],
    [40, 75, 35],
    [41, 80, 37],
    [42, 85, 40],
    [43, 90, 42],
    [44, 95, 45],
    [45, 100, 50],
    [46, 110, 55],
    [47, 115, 60],

];

type KeepUserData = { total: number, inactive_total: number };
type PlayUserData = {
    date: number,
    user: number,
    new_user: number
}
type UserPlayData = {
    day: number,
    count: number
}
interface UserAPIData {
    play: UserPlayData[],
    new_play: UserPlayData[],
    total_users: number,
    inactive_users: number,
    server_date: number
}
type IndexingNum = { [key: number]: number };

export default function User() {
    const [keepuser, setKeepuser] = useState<KeepUserData>({ total: 0, inactive_total: 0 });
    const [playUser, setPlayUser] = useState<PlayUserData[]>([]);

    const loadData = async function() {
        const { code, data: anyData } = await request(`user`);
        const data = anyData as UserAPIData;

        if (code !== 200) return;

        console.log(data);
        setKeepuser({
            total: data.total_users,
            inactive_total: data.inactive_users
        });
        
        const indexCount: IndexingNum = {};
        const indexNewCount: IndexingNum = {};
        const users: PlayUserData[] = [];
        
        data.play.forEach(v => indexCount[v.day] = v.count);
        data.new_play.forEach(v => indexNewCount[v.day] = v.count);

        for (let i = 1; i <= data.server_date; i++) {
            users.push({
                date: i,
                user: indexCount[i] || 0,
                new_user: indexNewCount[i] || 0
            });
        }

        setPlayUser(users);
    }

    useEffect(() => {
        loadData();
    }, []);


    return <main className={style.main}>
        <h1>유저 현황</h1>

        <PlayUserBox users={playUser} />
        <KeepUserBox total_data={keepuser} />
    </main>;
}

function PlayUserBox({ users }: { users: PlayUserData[] }) {
    const data = {
        labels: users.map(v => `${v.date}일`),
        datasets: [
            {
                label: "유저",
                data: users.map(v => v.user),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 0, 0)",
                // fill: {
                //     target: "origin", // Set the fill options
                //     above: "rgba(255, 0, 0, 0.3)"
                // }
              },
            {
                label: "새로운 유저",
                data: users.map(v => v.new_user),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.3)",
                // fill: "start",
                // backgroundColor: (context: ScriptableContext<"line">) => {
                //     const ctx = context.chart.ctx;
                //     const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                //     gradient.addColorStop(0, "rgba(250,174,50,1)");
                //     gradient.addColorStop(1, "rgba(250,174,50,0)");
                //     return gradient;
                // },
                fill: {
                    target: "origin",
                    // above: "rgba(0, 0, 255, 0.3)"
                }
              },
        ],
    }

    const options = {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            intersect: false,
          }
        },
        responsive: true,
        tension: 0.3,
        maintainAspectRatio: false,
        lineHeightAnnotation: {
            always: false,
            hover: true,
            color: "white",
            nodash: false
        },
        scale: {
            ticks: {
              precision: 0
            }
        }
    }

    return <div className={[style.box, style.user_play].join(' ')}>
        <h2>플레이 현황</h2>
        <div className={style.chart_container}>
            <Line options={options} data={data} />
        </div>
    </div>
}

function KeepUserBox({ total_data }: { total_data: KeepUserData }) {
    const data = {
        labels: ["최근 접속", "장시간 미접속"],
        datasets: [
            {
                // label: "최근 접속",
                data: [total_data.total - total_data.inactive_total, total_data.inactive_total],
                // borderColor: "rgb(255, 99, 132)",
                backgroundColor: [
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(244, 67, 54, 0.6)",
                ],
            }
        ],
    }

    const options = {
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            intersect: false,
          }
        },
        responsive: true,
        tension: 0.3,
        maintainAspectRatio: false,
    }

    return <div className={[style.box, style.keep].join(' ')}>
        <h2>접속 현황</h2>

        <div className={style.chart_container}>
            <Pie options={options} data={data} />
        </div>
    </div>;
}