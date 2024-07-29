import { Line, Pie } from 'react-chartjs-2';
import style from './user.module.css';
import { ArcElement, ChartData, Filler, ScriptableContext, Tooltip } from 'chart.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from "chart.js";
  
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Filler, Tooltip);

const testValues = [
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


export default function User() {
    return <main className={style.main}>
        <h1>유저 현황</h1>

        <PlayUserBox />
        <KeepUserBox />
    </main>;
}

function PlayUserBox() {
    const data: ChartData = {
        labels: testValues.map(v => v[0] + "일"),
        datasets: [
            {
                label: "유저",
                data: testValues.map(v => v[1]),
                borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(255, 0, 0)",
                // fill: {
                //     target: "origin", // Set the fill options
                //     above: "rgba(255, 0, 0, 0.3)"
                // }
              },
            {
                label: "새로운 유저",
                data: testValues.map(v => v[2]),
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
    }

    return <div className={[style.box, style.user_play].join(' ')}>
        <h2>플레이 현황</h2>
        <div className={style.chart_container}>
            <Line options={options} data={data} />
        </div>
    </div>
}

function KeepUserBox() {
    const data: ChartData = {
        labels: ["최근 접속", "장시간 미접속"],
        datasets: [
            {
                // label: "최근 접속",
                data: [100, 50],
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