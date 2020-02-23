import { Component, OnInit, Input, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import Vibrant = require('node-vibrant');

import {
  trigger,
  style,
  animate,
  transition,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [ // each time the binding value changes
        query(
          ':leave', 
          [
          stagger(100, [
            animate('0.25s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.25s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent implements OnInit, AfterViewInit {
  @Input() photo;
  colors = [];
  holder = [];
  isShowing = false;
  disabled = false;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() { }

  getColors() {
    Vibrant.from(this.photo.urls.small).getPalette((err, palette:any) => {

      this.holder = Object.keys(palette).map(function (key) {
        return palette[key];
      });
      
      this.colors = [...this.holder];
      this.cd.detectChanges();
    });
  }

  toggle() {
    this.isShowing = !this.isShowing;
    if (!this.colors.length && !this.holder.length) {
      this.getColors();
    } else {
      (this.colors.length && this.holder.length) ? this.colors = [] : this.colors = [...this.holder];
    }

    this.disabled = true;

    setTimeout(() => {
      this.disabled = false;
      this.cd.detectChanges();
    }, 1000);

  }


}
