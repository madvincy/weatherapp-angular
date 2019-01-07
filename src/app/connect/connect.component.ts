import { Component, OnInit, Input} from '@angular/core';
import { WeatherService } from '../weather.service';
import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Moodsactivity} from '../connect/moodsActivity';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})

export class ConnectComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  city = 'Eldoret';
  humidity = '';
  pressure = '';
  icon = '';
  weather = '';
  suggestion = '';
  temp = '';
  getForecast = '';
  weatherForecast = [];
  error: any;
  submitted = false;
  moodactivities: Moodsactivity[];
  moodactivitie: Moodsactivity[];
  moodsactivity = new Moodsactivity();
  message: string;


  constructor(private weatherService: WeatherService ) { }
// constructors only initializes class members
// shows that angular is done creating the components
  ngOnInit() {
    this.getCurrentWeather();
    this.getFiveDayForecast();
     this.commentArea();
     this.getMoodactivities();

  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
// daily forecast
  getCurrentWeather() {
    const sub = this.weatherService.currentWeather(this.city).subscribe(res => {
      this.pressure = res.pressure;
      this.humidity = res.humidity;
      this.weather = res.weather.description;
      this.temp = res.temp;
      this.icon = res.weather.icon;
      this.commentArea();

      }, (err) => {
        this.error = err;
      }, () => {
        if (sub) {
          this.subscriptions.push(sub);
      }
    });
  }
  // new function for the five days weather focust with one data per day
  getFiveDayForecast() {
    const sub = this.weatherService.getForecast(this.city)
    .subscribe(data => {
      this.weatherForecast = data;
      }, (err) => {
        this.error = err;
      }, () => {
        this.subscriptions.push(sub);
      });
    }

  searchCity() {
    this.getCurrentWeather();
    this.getFiveDayForecast();
  }

  commentArea() {
    switch (this.weather) {
      case 'clear sky':
        this.suggestion = 'you can go for swimming or picknic';
        break;
      case 'few clouds':
        this.suggestion = 'carry a simple sweater and you can do some games';
        break;
      case 'light rain':
        this.suggestion = 'Carry umbrella and wear jacket';
        break;
      case 'clouds':
        this.suggestion = 'you should take his girlfriend out for coffee';
        break;
      case 'broken clouds':
        this.suggestion = 'Wear a light Sweater';
        break;
      case 'scattered clouds':
       this.suggestion = 'stay at home and watch movies';
       break;
      default:
        this.suggestion = 'check out and see the appropriate dressing code';
        break;
      }

  }
  newMoodsactivities(): void {
    this.submitted = false;
    this.moodsactivity = new this.addMoodactivities();
  }

addMoodactivities(): void {
   this.submitted = true;
   this.weatherService.addMoodsactivity(this.moodsactivity)
    .subscribe(() => this.getMoodactivities());
 }
 delete(moodAct: Moodsactivity): void {
  // this.submitted = true;
  this.moodactivitie = this.moodactivitie.filter(ma => ma !== moodAct);
  this.weatherService.deleteMoodsactivity(moodAct.id)
      .subscribe();
 }
 getMoodactivities() {
  return this.weatherService.getMoodactivities()
    .subscribe(
      moodactivities => {
        console.log('magsahgdhas', moodactivities);
        this.moodactivitie = moodactivities;
        console.log('what', this.moodactivitie);
      }
    );
}

}
