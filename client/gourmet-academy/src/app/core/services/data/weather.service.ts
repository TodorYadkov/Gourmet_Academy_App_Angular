import { Injectable } from '@angular/core';
import { constants } from '../../environments/constants';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IWeather } from 'src/app/models/weather.interfaces';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }

  getWeatherNow(weatherApiKey: string): Observable<IWeather> {
    const url = constants.weatherURL(weatherApiKey);
    return this.http.get<IWeather>(url);
  }
}