import {Component, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {NavController} from "ionic-angular";
import {Chart} from 'chart.js';
import {VisitorAnalyticsProvider} from "../../providers/visitor-analytics/visitor-analytics";

@Component({
    selector: 'visitor-statistics',
    templateUrl: 'visitor-statistics.html'
})
export class VisitorStatisticsComponent {
    @ViewChild('chart') chartCanvas: any;

    chart: Chart;

    public chartOptions: any = {
        responsive: true,
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    };

    public chartLabels: Array<any>;
    public chartType: string = 'bar';
    public chartLegend: boolean = false;
    public chartDatasets: Array<any>;
    public chartColors: Array<any>;

    yearRange = [
        2016,
        2017,
        2018
    ];

    selectedYear: number = this.yearRange[0];

    week_labels: Array<string> = ["S", "M", "T", "W", "R", "F", "S"];
    time_labels: Array<string> = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"];
    background_colors: Array<string> = ['rgba(54,162,235,0.3)'];
    borderColors: Array<string> = ['rgba(54,162,255,1)'];


    selectedDate: string;
    selectedMonth: string;

    constructor(public navCtrl: NavController, public http: HttpClient, private visitorAnalytic: VisitorAnalyticsProvider) {
    }

    ngAfterViewInit() {
        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: this.chartType,
            data: {
                labels: [],
                datasets: [],
                options: this.chartOptions
            }
        });

        this.visitorAnalytic.getCountsForBusiestHours()
            .then(res => {
                const dataSet: DataSet = {
                    label: 'Busiest Hours',
                    data: [
                        res['8am'],
                        res['9am'],
                        res['10am'],
                        res['11am'],
                        res['12pm'],
                        res['1pm'],
                        res['2pm'],
                        res['3pm'],
                        res['4pm'],
                        res['5pm'],
                        res['6pm']
                    ],
                    backgroundColor: [
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)',
                        'rgba(58, 177, 93, 0.3)'


                    ],
                    borderColor: [
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)',
                        'rgba(58, 177, 93, 1)'
                    ],
                    borderWidth: 1
                };
                this.updateChart(this.chart, this.time_labels, [dataSet]);
            })
            .catch(err => alert(err));
    }

    btnClicked(btn) {
        let day_data = [1, 5, 23, 30, 59, 87, 77, 43, 38, 24, 9];
        let total = 0;

        for (let i = 0; i < day_data.length; i++) {
            total += day_data[i];
        }

        if (btn == '0') {
            /** Busiest hour */
            this.visitorAnalytic.getCountsForBusiestHours()
                .then(res => {
                    const dataSet: DataSet = {
                        label: 'Busiest Hours',
                        data: [
                            res['8am'],
                            res['9am'],
                            res['10am'],
                            res['11am'],
                            res['12pm'],
                            res['1pm'],
                            res['2pm'],
                            res['3pm'],
                            res['4pm'],
                            res['5pm'],
                            res['6pm']
                        ],
                        backgroundColor: [
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)'

                        ],
                        borderColor: [
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)'
                        ],
                        borderWidth: 1
                    };
                    this.updateChart(this.chart, this.time_labels, [dataSet]);
                })
                .catch(err => alert(err));
        }
        else if (btn == '1') {
            /** Busiest Day */
            this.visitorAnalytic.getCountsForBusiestDay()
                .then(res => {
                    const dataSet: DataSet = {
                        label: 'Busiest Days',
                        data: [
                            res['Sun'] ? res['Sun'] : 0,
                            res['Mon'] ? res['Mon'] : 0,
                            res['Tues'] ? res['Tues'] : 0,
                            res['Wed'] ? res['Wed'] : 0,
                            res['Thur'] ? res['Thur'] : 0,
                            res['Fri'] ? res['Fri'] : 0,
                            res['Sat'] ? res['Sat'] : 0
                        ],
                        backgroundColor: [
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)',
                            'rgba(58, 177, 93, 0.3)'
                        ],
                        borderColor: [
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)',
                            'rgba(58, 177, 93, 1)'

                        ],
                        borderWidth: 1
                    };
                    this.updateChart(this.chart, this.week_labels, [dataSet]);
                })
                .catch(reason => {
                    alert(reason);
                });
        }

        else if (btn == '2') {
            /** Specific Year Count */
            this.visitorAnalytic.getCountByYear(this.selectedYear)
                .then(res => {
                    let dataSet: DataSet = {
                        label: `${this.selectedYear} Count`,
                        data: [res],
                        backgroundColor: [
                            'rgba(58, 177, 93, 0.3)'

                        ],
                        borderColor: [
                            'rgba(58, 177, 93, 1)'

                        ],
                        borderWidth: 1
                    };

                    this.updateChart(this.chart, [`${this.selectedYear}`], [dataSet]);
                })
                .catch(res => {
                    alert(res);
                });
        }

        else if (btn == '3') {
            /** Specific Day */
            const date = new Date(this.selectedDate);
            date.setDate(date.getDate() + 1);
            this.visitorAnalytic.getCountForSelectedDate(date)
                .then(res => {
                    const dataSet: DataSet = {
                        label: `${this.selectedDate}`,
                        data: [res],
                        backgroundColor: [
                            'rgba(58, 177, 93, 0.3)'

                        ],
                        borderColor: [
                            'rgba(58, 177, 93, 1)'

                        ],
                        borderWidth: 1
                    };

                    this.updateChart(this.chart, ['Specified Date Count'], [dataSet]);
                })
                .catch(err => alert(err));
        }

        else if (btn == '4') {
            console.log(new Date(this.selectedMonth).toDateString());
            const date = new Date(this.selectedMonth);
            date.setMonth(date.getMonth() + 1);
            date.setDate(1);
            /** Specific Month */

            this.visitorAnalytic.getCountForSelectedMonth(date)
                .then(res => {
                    const dataSet: DataSet = {
                        label: `${this.selectedMonth}`,
                        data: [res],
                        backgroundColor: [
                            'rgba(58, 177, 93, 0.3)'

                        ],
                        borderColor: [
                            'rgba(58, 177, 93, 1)',

                        ],
                        borderWidth: 1
                    };


                    this.updateChart(this.chart, ['Specified Month Count'], [dataSet]);
                })
                .catch(err => alert(err));
        }

        else {
            // this.barChart.config.data.datasets[0].data = temp2;
            // this.barChart.config.data.labels = week_labels;
            // this.barChart.update();
        }

    }

    updateChart(chart: Chart, dataLabels: string[], dataSets: DataSet[]) {
        chart.data.labels = [];
        chart.data.datasets = [];
        chart.update();


        //Add data to chart
        chart.data.labels = dataLabels;
        chart.data.datasets = dataSets;
        chart.update();
    }
}

interface DataSet {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
}

