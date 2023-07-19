import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  textYearFooter!: string;

  constructor() { }

  ngOnInit(): void {
    this.textYearFooter = new Date().getFullYear().toString();
  }
}