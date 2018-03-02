import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Chart } from 'chart.js';

import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('barCanvas') barCanvas;
 
    barChart: any;
 
    constructor(public navCtrl: NavController, public http: HttpClient) {
 
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
                            beginAtZero:true
                        }
                    }]
                }
            }
			
			});
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
		this.barChart.config.data.datasets[0].data = tempTot;
		this.barChart.config.data.labels = week_labels;
		this.barChart.update();
		}
		
		else if (btn == '2') {
		/** Specific Year Count */
		temp2[0] = 3452;
		
		
		let key_name = 'x-api-key';
		let key = 'mgpLtp0bwP6XX3wFUOK2673KxF3mVrm6aVzqMfbv'
		
		let url = 'https://3ujc77b01b.execute-api.us-east-2.amazonaws.com/prod/visitorinfo';
        let varHeaders = new HttpHeaders().append(key_name, key).append('CountPerYear', '2017');
           
        this.http.get(url, {headers: varHeaders}).subscribe(
               (response) => {
                   console.log(response);
               }, (error: HttpErrorResponse) => {
                   console.error(error.error.message);
               }
           );
		
		
		
		
		
		this.barChart.config.data.datasets[0].data = temp2;
		this.barChart.config.data.labels = ["Total count for this Year"];
		this.barChart.update();		
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
			
	};
}