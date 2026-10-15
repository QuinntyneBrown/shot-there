import { Component } from '@angular/core';

import { ShellComponent } from './core/shell/shell.component';

@Component({
  selector: 'app-root',
  imports: [ShellComponent],
  templateUrl: './app.html',
})
export class App {}
