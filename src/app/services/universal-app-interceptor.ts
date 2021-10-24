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
import {JwtModalComponent} from '../jwt-modal/jwt-modal.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable()
export class UniversalAppInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    /**
     * Permet d'intercepter les requetes http pour les gerer.
     * Ici, cela sert principalement pour le Jwt.
     * Recupere le Jwt et l'insere dans le header de la requete avant son envoi.
     * Apres chaque requete, si il y a un code http 401 qui contient comme message de statut 'expired' et 'jwt', lance la modale.
     * @param req   La requete a gerer.
     * @param next  Le handler http.
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        try {
            const token = this.authService.getJWTToken();
            req = req.clone({
                url: req.url,
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(token);
            this.authService.openJwtRefreshDialog();
            // console.log(diff);
        } catch (e) {
            console.log(e);
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
