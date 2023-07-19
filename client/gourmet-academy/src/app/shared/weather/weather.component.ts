import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/services/data/data.service';
import { WeatherService } from 'src/app/core/services/data/weather.service';
import { Subscription, map, mergeMap } from 'rxjs';
import { IEnvironments } from 'src/app/models/environment.interfaces';
import { IWeather } from 'src/app/models/weather.interfaces';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit, OnDestroy {

  subscription!: Subscription;
  weatherData: any;

  constructor(
    private dataService: DataService,
    private weatherService: WeatherService,
  ) { }

  ngOnInit(): void {
    this.subscription = this.dataService.getAPIKeys()
      .pipe(
        mergeMap((apiKeys: IEnvironments) => this.weatherService.getWeatherNow(apiKeys.weatherApiKey)),
      ).subscribe({
        next: (data) => {
          this.weatherData = data;
          this.weatherData.current.condition.icon = this.weatherData.current.condition.icon.startsWith('//cdn.weatherapi.com/')
            ? this.weatherData.current.condition.icon.replace('//cdn.weatherapi.com/', '/assets/')
            : this.weatherData.current.condition.icon;
        },
        error: (error) => console.error(error),
      });
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}