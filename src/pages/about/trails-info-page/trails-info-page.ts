import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'trails-info-page',
    templateUrl: 'trails-info-page.html'
})
export class TrailsInfoPage {
    constructor(navCtrl: NavController) {}

	/*onFileSelected() {
		let $img: any = document.querySelector('#file');

		if (typeof (FileReader) !== 'undefined') {
				let reader = new FileReader();

				reader.onload = (e: any) => {
				this.pdfSrc = e.target.result;
				};

		reader.readAsArrayBuffer($img.files[0]);
		}
	};*/
}
