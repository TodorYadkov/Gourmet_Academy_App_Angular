import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {
  pageX: number;
  pageY: number;
  mouseY: number = 0;
  mouseX: number = 0;

  constructor(private title: Title) {
    this.pageX = document.documentElement.clientWidth;
    this.pageY = document.documentElement.clientHeight;

  }


  ngOnInit(): void {
    this.title.setTitle('404');

  }

  // Code is from https://codepen.io/diogo_ml_gomes/pen/PyWdLb
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    // verticalAxis
    this.mouseY = event.pageY;
    const yAxis = (this.pageY / 2 - this.mouseY) / this.pageY * 300;
    // horizontalAxis
    this.mouseX = event.pageX / -this.pageX;
    const xAxis = -this.mouseX * 100 - 100;

    const ghostEyes = document.querySelector('.box__ghost-eyes');
    if (ghostEyes) {
      ghostEyes.setAttribute(
        'style',
        `transform: translate(${xAxis}%, -${yAxis}%);`
      );
    }
  }
}