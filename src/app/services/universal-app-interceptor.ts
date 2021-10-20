import {Injectable} from '@angular/core';
import {
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class UniversalAppInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            const token = this.authService.getJWTToken();
            req = req.clone({
                url: req.url,
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (e) {
            // console.log(e);
            console.log('JWT non trouvé');
        }
        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // do stuff with response if you want
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        const statusText = err.statusText.toLocaleLowerCase();
                        if (statusText.includes('expired') && statusText.includes('jwt')) {
                            console.log(statusText.includes('expired') && statusText.includes('jwt'));
                            this.authService.signOut();
                        }
                    }
                }
            })
        );
    }
}
