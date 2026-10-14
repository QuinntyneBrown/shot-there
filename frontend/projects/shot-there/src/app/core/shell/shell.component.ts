import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CompareBarComponent } from '../compare/compare-bar.component';
import { SiteFooterComponent } from '../layout/site-footer.component';
import { HeaderComponent } from './header.component';
import { SkipLinkComponent } from './skip-link.component';

@Component({
  selector: 'st-shell',
  imports: [
    RouterOutlet,
    SkipLinkComponent,
    HeaderComponent,
    SiteFooterComponent,
    CompareBarComponent,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {}
