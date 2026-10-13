import { Component } from '@angular/core';

import { ShellComponent } from './core/shell/shell.component';

@Component({
  selector: 'st-root',
  imports: [ShellComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
