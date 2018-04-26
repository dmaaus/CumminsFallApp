import {Component, ViewChild} from '@angular/core';
import {PlacePicProvider} from '../../providers/place-pic/place-pic'
import {Slides} from 'ionic-angular';


@Component({
    selector: 'place-pic-card',
    templateUrl: 'place-pic-card.html'
})
export class PlacePicCardComponent {

    slideData: Array<string>;

    url: string;
    apiKey: string;
    header: string;

    @ViewChild(Slides) cardSlides: Slides;

    constructor(private eventsProvider: PlacePicProvider) {
        this.slideData = new Array<string>(0);

        this.apiKey = 'AIzaSyAC2eqrBHkT4fOYU5VTm503Ezh0IRlhCCg';
        this.url = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=';
        this.header = "Cummins Fall State Parks Photos"

        this.eventsProvider.getEventsFromUrl().subscribe(res => {
            const result = res['result'];
            let photos = result.photos;
            photos.forEach(p => {
                this.slideData.push(this.url + p['photo_reference'] + "&key=" + this.apiKey);
            });
            this.cardSlides.update();
        });
    }
}
