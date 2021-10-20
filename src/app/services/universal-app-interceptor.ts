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

    constructor(private authService: AuthService,
                private dialog: MatDialog) { }

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
            const newDate = new Date(this.authService.getJwtExpieryTime()).getTime(); // convert string date to Date object
            const currentDate = new Date().getTime() / 1000; // Pour avoir un temps en secondes, et non en millisecondes.
            const diff = Math.floor(newDate - currentDate);
            if (diff < 300) {
                this.openJwtRefreshDialog(newDate);
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

    openJwtRefreshDialog(newDate: number): void {
        if (!this.jwtDialogOpened) {
            this.jwtDialogOpened = true;
            const dialogRef = this.dialog.open(JwtModalComponent, {
                // width: '250px',
                data: newDate
            });

            dialogRef.afterClosed().subscribe(result => {
                clearInterval(dialogRef.componentInstance.interval);
                this.jwtDialogOpened = false;
                // console.log(result);
                if (result) {
                    console.log(result);
                }
            });
        }
    }
}
