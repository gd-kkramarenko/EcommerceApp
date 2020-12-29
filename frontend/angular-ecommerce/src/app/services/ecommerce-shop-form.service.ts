import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class EcommerceShopFormService {

  private countriesUrl = 'http://localhost:8000/api/countries';
  private statesUrl = 'http://localhost:8000/api/states'

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]>{

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(map(response => response._embedded.countries));
  }

  getStates(theCountryCode: string): Observable<State[]>{

    //search url
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?countryCode=${theCountryCode}`

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(map(response => response._embedded.states));

  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{
    
    let months: number[] = [];

    // build an array for "Month" dropdown list
    // start at current number and go to 12
    // startMonth param is to remove months 1,2,3 if the expiration year is current year,and current month is 4
    for( let theMonth = startMonth; theMonth <= 12; theMonth++){
      months.push(theMonth);
    }

    // wrap array in of() to create an Observable - so we may subscribe to changes in months choice
    return of(months);
  }

  getCreditCardYears(): Observable<number[]>{

    let years: number[] = [];

    // build an array for "Year" dropdown list
    // start at current number and go 10 years more

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      years.push(theYear);
    }

    return of(years);
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
