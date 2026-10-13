import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { SkipLinkComponent } from './skip-link.component';

@Component({
  selector: 'st-shell',
  imports: [RouterOutlet, SkipLinkComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css'
})
export class ShellComponent {}
