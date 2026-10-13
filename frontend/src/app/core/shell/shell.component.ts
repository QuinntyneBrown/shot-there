import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header.component';
import { SkipLinkComponent } from './skip-link.component';

@Component({
  selector: 'st-shell',
  imports: [RouterOutlet, SkipLinkComponent, HeaderComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {}
