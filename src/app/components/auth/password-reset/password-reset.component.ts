import { Component, OnInit, OnDestroy, Renderer2  } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { App } from '../../../../config'

@Component({
    selector: 'app-password-reset',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

    constructor(private renderer: Renderer2, private titleService: Title, private meta: Meta) {
        this.renderer.removeClass(document.body, 'skin-purple');
        this.renderer.removeClass(document.body, 'sidebar-mini');
        this.renderer.addClass(document.body, 'login-page');
    }

    ngOnInit() {
        this.SEOSettings();
    }

    SEOSettings() {
        this.titleService.setTitle(`${App.NAME} | Forget Password`)
        // this.meta.addTag({name: 'keywords', content: 'Angular Project, Create Angular Project'});
        // this.meta.addTag({name: 'description', content: 'Angular project'});
        // this.meta.addTag({name: 'author', content: ''});
        // this.meta.addTag({name: 'robots', content: 'index, follow'});
    }

    ngOnDestroy() {
        this.renderer.addClass(document.body, 'skin-purple');
        this.renderer.addClass(document.body, 'sidebar-mini');
    }

}
