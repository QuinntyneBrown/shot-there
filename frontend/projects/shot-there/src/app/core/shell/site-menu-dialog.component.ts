import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRIMARY_NAV_LINKS } from './primary-nav-links';

@Component({
  selector: 'st-site-menu-dialog',
  imports: [RouterLink],
  templateUrl: './site-menu-dialog.component.html',
  styleUrl: './site-menu-dialog.component.css'
})
export class SiteMenuDialogComponent {
  private readonly dialogRef = inject(DialogRef);
  protected readonly links = PRIMARY_NAV_LINKS;

  close(): void {
    this.dialogRef.close();
  }
}
