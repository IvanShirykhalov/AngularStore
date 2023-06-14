import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse, HttpParams} from "@angular/common/http";
import {catchError, delay, Observable, retry, throwError} from "rxjs";
import {IProduct} from "../models/products";
import {ErrorService} from "./error.service";


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
  ) {

  }

  private errorHandler(error: HttpErrorResponse) {
    this.errorService.handle(error.message)
    return throwError(() => error.message)
  }

  getAll(): Observable<IProduct[]> {
    // @ts-ignore
    return this.http.get<IProduct[]>('https://fakestoreapi.com/products',

      {
        params: new HttpParams().append('limit', 5) //- аналог HttpParams(fromObject: {'limits': 5})
      }
    ).pipe(
      // задержка в 2 сек.
      //delay(2000),
      retry(2),
//обработока ошибок
      catchError(this.errorHandler).bind(this)
    )
  }
}
