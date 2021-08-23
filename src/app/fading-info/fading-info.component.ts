import {
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    Directive,
    Input,
    OnDestroy,
    OnInit,
    Type,
    ViewChild,
    ViewContainerRef
} from '@angular/core';
import {SpecialResponse} from '../loot-table/loot-table.component';


@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[adHost]',
})
export class AdDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}

@Component({
    selector: 'app-fading-info',
    templateUrl: './fading-info.component.html',
    styleUrls: ['./fading-info.component.scss']
})
export class FadingInfoComponent implements OnDestroy {

    currentAdIndex = -1;
    @ViewChild(AdDirective, {static: true}) adHost: AdDirective;
    interval: any;

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    loadComponent(title: string, message: string, color: string) {
        const adItem = new AdItem(BannerComponent, {title, message, color});

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);

        const componentRef = this.adHost.viewContainerRef.createComponent<BannerComponent>(componentFactory);
        componentRef.instance.data = adItem.data;

        this.interval = setTimeout(() => {
            this.adHost.viewContainerRef.remove(this.adHost.viewContainerRef.indexOf(componentRef.hostView));
        }, 4500);
    }

    loadComponentFromSpecialResponse(response: SpecialResponse) {
        this.loadComponent(response.status_message, JSON.stringify(response.data), '' + response.status);
    }
    loadComponentFromSpecialResponseWithoutTitle(response: SpecialResponse) {
        this.loadComponent('', response.status_message, '' + response.status);
    }
}

@Component({
    template: `
        <div class="banner" #BannerElement>
            <h3>{{data.title}}</h3>

            <p>{{data.message}}</p>

        </div>
    `,
    styleUrls: ['./fading-info.component.scss']
})
export class BannerComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() data: any;
    @ViewChild('BannerElement') Banner;
    timer: any;

    ngOnInit() {
        this.timer = setTimeout(() => {
            this.Banner.nativeElement.style.setProperty('opacity', '0');
        }, 3000);
    }

    ngAfterViewInit() {
        if (this.data.color.startsWith('2')) {
            this.Banner.nativeElement.classList.add('Mission-Complete');
        } else if (this.data.color.startsWith('4')) {
            this.Banner.nativeElement.classList.add('SQL-Error');
        } else if (this.data.color.startsWith('5')) {
            this.Banner.nativeElement.classList.add('Server-Error');
        } else {
            this.Banner.nativeElement.classList.add('Unknown-Error');
        }
    }

    ngOnDestroy() {
        clearInterval(this.timer);
    }
}


export class AdItem {
    constructor(public component: Type<any>, public data: any) {
    }
}


