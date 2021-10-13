import { Injectable, Inject, Optional } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class UniversalAppInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
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
        return next.handle(req);
    }
}
