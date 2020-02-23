import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ViewChild, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import Unsplash, { toJson } from 'unsplash-js';

const unsplash = new Unsplash({
  accessKey: "48eead667cf82053ea88bedceea8ce8e42075b78c86661c974c5a5a898202768",
  timeout: 500 // values set in ms
});

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, AfterViewInit {
  photos: Array<any> = [];

  constructor(
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {

    if (localStorage.getItem('unsplashPhotos')) {
      const data = JSON.parse(localStorage.getItem('unsplashPhotos'));
      this.photos = data.photos;

      let createdAt = data.lastDate;
      let now = Date.now();

      const oneDay = 60 * 60 * 24;
      var olderThan24Hrs = (now - createdAt) < oneDay;
      // console.log('compoareDatesBoolean', olderThan24Hrs);

      // if photos are older than a day, get a new set
      if (olderThan24Hrs) {
        this.getPhotos();
      }

    } else {
      this.updateLocalStorage();
    }
  }

  ngAfterViewInit() {
    // check for photos
    if (!this.photos.length) {
      // get some photos
      this.getPhotos();
    }
  }


  getPhotos() {
    unsplash.photos.listPhotos(1, 16, "latest")
      .then(toJson)
      .then(json => {
        this.photos = [...json];
        this.updateLocalStorage();
      })
    this.cd.detectChanges();
  }

  updateLocalStorage() {
    const unsplashPhotos = {
      lastDate: Date.now(),
      photos: [...this.photos]
    }
    localStorage.setItem('unsplashPhotos', JSON.stringify(unsplashPhotos));
  }

}
