import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface Spinner {
  spinnings: [
    {
      id: number,
      sections: [
        {
          id: number,
          text: string,
          fillStyle: string
        }
      ]
    }
  ],
  winners: [
    {
      id: number,
      spinningID: number,
      winSectionID: number
    }
  ]
}

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private http: HttpClient) {
  }

  getAllData() {
    return this.http.get<Spinner>("https://patsu-rar.github.io/spinner-data/db.json");
  }

  getWinningId(firstName?: string | null, email?: string | null, spinningID?: number | null) {
    return this.http.get<any>("https://my-json-server.typicode.com/Patsu-rar/spinner-data/winners");
  }
}
