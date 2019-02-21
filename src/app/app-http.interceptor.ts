import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {UserService} from './users/user.service';

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {

  headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('Token')
  });

  constructor(private router: Router, private us: UserService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req.clone();
    console.log(localStorage.getItem('Token'));
    console.log(localStorage.getItem('auth_token'));
    if (localStorage.getItem('Token')) {
      authReq = req.clone({ headers: req.headers.set('Authorization', localStorage.getItem('Token')) });
    }

    return next.handle(authReq)
      .catch(err => {
        // onError
        console.log(err);
        if (err instanceof HttpErrorResponse) {
          console.log(err.status);
          console.log(err.statusText);
          if (err.status === 401) {
            this.us.logout();
          }
        }
        return Observable.throw(err);
      }) as any;
  }

}
