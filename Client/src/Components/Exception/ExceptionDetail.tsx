import style from './exception_detail.module.css';
import { Head } from './Exception';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS,  ChartData, CategoryScale, LinearScale, PointElement, Filler, Tooltip, BarElement } from 'chart.js';
import { testValues } from '../User/User';

ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, Filler, Tooltip);

export default function ExceptionDetail() {
    return <main className={style.main}>
        <Head title='오류 타입: System.NullReferenceException' />
    
        <ChartBox />

        <h2>상세 정보</h2>
        <TableHead />
    </main>;
}

function ChartBox() {
    const data: ChartData = {
        labels: testValues.map(v => v[0] + "일"),
        datasets: [
            {
                // label: "최근 접속",
                data: testValues.map(v => v[1]),
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

    return <section className={style.chart_box}>
        <h2>개요</h2>

        <div className={style.chart_container}>
            <Bar options={options} data={data} />
        </div>
    </section>;
}

function TableHead() {
    return <section className={style.tb_head}>
        <div></div>
        <div>스크립트 / Line</div>
        <div>횟수</div>
    </section>
}