import {Component} from '@angular/core';
import {WeatherInfo, WeatherProvider} from '../../providers/weather/weather';

@Component({
    selector: 'weather-card',
    templateUrl: 'weather-card.html'
})
export class WeatherCardComponent {

    header: string;
    weatherInfo: WeatherInfo;

    constructor(private weatherProvider: WeatherProvider) {
        this.header = 'Current Weather';
        this.weatherInfo = new WeatherInfo;

        this.weatherProvider.getEventsFromUrl().subscribe(res => {
            const weatherResult = res['weather'];
            this.weatherInfo.icon_id = weatherResult[0].icon;
            this.weatherInfo.weather_desc = weatherResult[0].description;
            this.weatherInfo.max_temp = res['main'].temp_max;
            this.weatherInfo.min_temp = res['main'].temp_min;
            this.weatherInfo.humidity = res['main'].humidity;

        });
    }
}
