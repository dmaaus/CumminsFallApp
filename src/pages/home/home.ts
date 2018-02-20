import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import { Chart } from 'chart.js';
import { CumminsFallsEventsProvider, CumminsFallsEvent, CumminsFallsHttpEvent } from '../../providers/events/event';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  @ViewChild('barCanvas') barCanvas;
 
    barChart: any;
 
    constructor(public navCtrl: NavController, public cumminsFallsEvents: CumminsFallsEventsProvider) {
    }
 
    ionViewDidLoad() {
		let httpObservable = this.cumminsFallsEvents.getEventsFromUrl();

		httpObservable.subscribe(events => {
			console.log(events.Events.filter(e => e.Account.indexOf('Cummins') != -1).length);
		})

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
		
		for (let i = 0; i < day_data.length; i++){
		total += day_data[i];
		}
		
		temp = [total,0,0,0,0,0,0];
	
		if (btn == '0') {
		this.barChart.config.data.datasets[0].data = day_data;
		this.barChart.config.data.labels = time_labels;
		this.barChart.update();
		}
				
		else {
		this.barChart.config.data.datasets[0].data = temp;
		this.barChart.config.data.labels = week_labels;
		this.barChart.update();
		}
			
	};
}