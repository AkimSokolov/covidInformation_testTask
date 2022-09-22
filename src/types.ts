export interface Data {
    Cumulative_number_for_14_days_of_COVID_19_cases_per_100000: string,
    cases: number, 
    continentExp: string,
    countriesAndTerritories: string,
    countryterritoryCode: string,
    dateRep: string,
    day: string,
    deaths: number,
    geoId: string,
    month: string,
    popData2019: string,
    year: string,
  }

  export interface DateScope{
    minDate: Date | undefined,
    maxDate: Date | undefined,
  }

  export interface Records{
    id: string,
    countryName: string,
    cases: number,
    deaths: number,
    allcases: number,
    alldeaths: number,
    cases1000: number,
    deaths1000: number
  }