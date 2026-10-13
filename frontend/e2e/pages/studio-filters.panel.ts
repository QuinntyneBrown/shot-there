import { Locator } from '@playwright/test';

/** The studio filter controls, wherever they render: the LG sidebar or the filters dialog. */
export class StudioFiltersPanel {
  readonly costMinimum: Locator;
  readonly costMaximum: Locator;
  readonly minimumSpace: Locator;

  constructor(readonly root: Locator) {
    this.costMinimum = root.getByRole('spinbutton', { name: 'Minimum' });
    this.costMaximum = root.getByRole('spinbutton', { name: 'Maximum' });
    this.minimumSpace = root.getByRole('combobox', { name: 'Minimum usable space' });
  }

  checkbox(label: string): Locator {
    return this.root.getByRole('checkbox', { name: label });
  }

  parking(label: string): Locator {
    return this.root.getByRole('group', { name: 'Parking' }).getByRole('radio', { name: label, exact: true });
  }

  async setCostRange(minimum: string, maximum: string): Promise<void> {
    await this.costMinimum.fill(minimum);
    await this.costMaximum.fill(maximum);
  }

  async check(...labels: string[]): Promise<void> {
    for (const label of labels) {
      await this.checkbox(label).check();
    }
  }

  async chooseMinimumSpace(label: string): Promise<void> {
    await this.minimumSpace.selectOption({ label });
  }

  async chooseParking(label: string): Promise<void> {
    await this.parking(label).check();
  }

  async selectedMinimumSpace(): Promise<string> {
    return this.minimumSpace.locator('option:checked').innerText();
  }
}
