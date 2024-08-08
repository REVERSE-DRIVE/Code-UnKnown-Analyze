import { Bar } from 'react-chartjs-2';
import style from './playtime.module.css';
import { testValues } from '../User/User';
import { TimeSelect } from '../Recycle/TimeSelect';

export function PlayTime() {
    return <main className={style.main}>
        <h1 className={style.title}>플레이 타임</h1>
        <div className={style.sub_title}>오늘 평균 플레이 타임은 <span>1분 20초</span> 입니다.</div>
        
        <GamePlayChart />
        <SceneTimeChart />
        <SceneTimeList />
    </main>;
}

function GamePlayChart() {
    const data = {
        labels: ["8월 7일", "8월 8일"],
        datasets: [
            {
                // label: "최근 접속",
                data: [5, 10],
                // borderColor: "rgb(255, 99, 132)",
                backgroundColor: "rgba(54, 162, 235, 0.6)",
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
        maintainAspectRatio: false,
    }

    return <section className={style.gameplay_box}>
        <Bar options={options} data={data} />
    </section>;
}

function SceneTimeChart() {
    const data = {
        labels: testValues.map(v => `${v[0]}일`),
        datasets: [
            {
                label: "domiMAP",
                data: testValues.map(v => v[1]),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
            },
            {
                label: "Lobby",
                data: testValues.map(v => v[2]),
                backgroundColor: "rgba(154, 23, 235, 0.6)",
            },
            {
                label: "test",
                data: testValues.map(v => (v[1] / v[2]) * 10),
                backgroundColor: "rgba(154, 123, 20, 0.6)",
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
        maintainAspectRatio: false,
        scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true
            }
        }
    }

    return <section className={style.scenetime_chart}>
        <h2>Scene 시간</h2>

        <div className={style.chart_container}>
            <Bar options={options} data={data} />
        </div>
    </section>
}

function SceneTimeList() {
    return <section className={style.scenetime_list}>
        <div className={style.header}>
            <h2>Scene 시간 목록</h2>
            <TimeSelect />
        </div>

        <div className={style.table_head}>
            <div>Scene</div>
            <div>평균 플레이 시간</div>
        </div>

        <SceneTime />
        <SceneTime />
        <SceneTime />
    </section>;
}

function SceneTime() {
    return <div className={style.box}>
        <div>domiMAP</div>
        <div>10시 10분 10초</div>
    </div>;
}