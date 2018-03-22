import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Chart} from 'chart.js';

import { HttpClient } from '@angular/common/http';
import { VisitorAnalyticsProvider } from '../../providers/visitor-analytics/visitor-analytics';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    @ViewChild('barCanvas') barCanvas;

    barChart: any;

    constructor(public navCtrl: NavController, public http: HttpClient, private visitorAnalytic: VisitorAnalyticsProvider) {
    }
	
    ionViewDidLoad() {

        this.barChart = new Chart(this.barCanvas.nativeElement, {

            type: 'bar',
            data: {
                labels: ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"],
                datasets: [{
                    label: '# of Visitors',

                    backgroundColor: [
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(54, 162, 235, 1)',
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }

        });
    }

    btnClicked(btn) {
        var day_data = [1, 5, 23, 30, 59, 87, 77, 43, 38, 24, 9];
        var time_labels = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"];
        var week_labels = ["S", "M", "T", "W", "R", "F", "Sat"];
        var total = 0;
        var temp = [0];

        for (let i = 0; i < day_data.length; i++) {
            total += day_data[i];
        }
	
	btnClicked(btn){
		var day_data = [1, 5, 23, 30, 59, 87, 77, 43, 38, 24, 9];
		var time_labels = ["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p"];
		var week_labels = ["S", "M", "T", "W", "R", "F", "Sat"];
		var total = 0;
		var temp = [0];
		var tempTot = [0];
		var temp2 = [5, 10, 15, 20, 25, 30, 35];
		
		for (let i = 0; i < day_data.length; i++){
		total += day_data[i];
		}
		
		tempTot = [total, 124, 234, 115, 167, 255, 111];
	
		if (btn == '0') {
		/** Busiest hour */
		this.barChart.config.data.datasets[0].data = day_data;
		this.barChart.config.data.labels = time_labels;
		this.barChart.update();
		}
		
		else if (btn == '1') {
		/** Busiest Day */
		this.visitorAnalytic.getCountsForBusiestDay()
			.subscribe(res => {
				let dataSet: DataSet = {
					label: 'Busiest Days',
					data: [
						res['Sun'],
						res['Mon'],
						res['Tues'],
						res['Wed'],
						res['Thur'],
						res['Fri'],
						res['Sat']
					],
					backgroundColor: [
						'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
                        'rgba(54, 162, 235, 0.3)',
						'rgba(54, 162, 235, 0.3)',
						'rgba(54, 162, 235, 0.3)',
						'rgba(54, 162, 235, 0.3)'
					],
					borderColor: [
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(54, 162, 235, 1)'
					],
					borderWidth: 1
				}

				this.updateChart(this.barChart, week_labels, [dataSet]);
			});
		}
		
		else if (btn == '2') {
		/** Specific Year Count */
		this.visitorAnalytic.getCountByYear(2017)
			.subscribe(res => {
				let dataSet : DataSet = {
					label: 'Count for 2017',
					data: [res['count']],
					backgroundColor: ['rgba(54, 162, 235, 0.3)'],
					borderColor: ['rgba(54, 162, 235, 1.0)'],
					borderWidth: 1
				};
				this.updateChart(this.barChart, ['Total count for this Year'], [dataSet]);
			});
		}
		
		else if (btn == '3') {
		/** Specific Day */
		this.barChart.config.data.datasets[0].data = [64];
		this.barChart.config.data.labels = ["Total count for this Day"];
		this.barChart.update();
		}
		
		else if (btn == '4') {
		/** Specific Month */
		this.barChart.config.data.datasets[0].data = [709];
		this.barChart.config.data.labels = ["Total count for this Month"];
		this.barChart.update();
		}
				
		else {
		this.barChart.config.data.datasets[0].data = temp2;
		this.barChart.config.data.labels = week_labels;
		this.barChart.update();
		}
			
	}

	updateChart(chart: Chart, dataLabels : string[], dataSets: DataSet[]) {
		//Clear chart
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