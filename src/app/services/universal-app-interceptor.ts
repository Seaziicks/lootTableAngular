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

    jwtDialogOpened = false;

    lastModalRefused: number;

    constructor(private authService: AuthService,
                private dialog: MatDialog) { }

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
            const JwtExpieryDate = new Date(this.authService.getJwtExpieryTime()).getTime(); // convert string date to Date object
            const currentDate = new Date().getTime() / 1000; // Pour avoir un temps en secondes, et non en millisecondes.
            const jwtExpieryDelay = Math.floor(JwtExpieryDate - currentDate);
            const lastJwtModalAskedDelay = Math.floor(currentDate - this.lastModalRefused);
            if (jwtExpieryDelay < 300 && (!this.lastModalRefused || lastJwtModalAskedDelay > 45)) {
                // Si je suis a moins de 5 minutes de l'expiration et que je n'ai pas demandé depuis 45s, je previens l'utilisateur.
                this.openJwtRefreshDialog(JwtExpieryDate);
            }
            // console.log(diff);
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

    /**
     * Permet de generer la modale Jwt. Cette modale permet de prevenir l'utilisateur que le Jwt va expirer.
     * Elle lui permet egalement de s'authentifier de nouveau, sans aller sur la page de login.
     * @param JwtExpieryDate   La date d'expiration du Jwt.
     */
    openJwtRefreshDialog(JwtExpieryDate: number): void {
        if (!this.jwtDialogOpened) {
            this.jwtDialogOpened = true;
            const dialogRef = this.dialog.open(JwtModalComponent, {
                // width: '250px',
                data: JwtExpieryDate,
                disableClose: true,
                hasBackdrop: false,
                position: {top: '64px', right: '10px'}
            });

            dialogRef.afterClosed().subscribe(result => {
                clearInterval(dialogRef.componentInstance.interval);
                this.lastModalRefused = new Date().getTime() / 1000;
                this.jwtDialogOpened = false;
                // console.log(result);
                if (result) {
                    console.log(result);
                }
            });
        }
    }
}
