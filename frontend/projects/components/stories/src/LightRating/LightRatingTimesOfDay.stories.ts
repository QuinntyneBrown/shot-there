import type { StoryObj } from '@storybook/angular';

import type { LightRatingComponent } from '@shot-there/components';

export const TimesOfDay: StoryObj<LightRatingComponent> = {
  render: () => ({
    template: `
      <table>
        <caption>Light at Trinity Bellwoods Park</caption>
        <thead>
          <tr><th scope="col">Time</th><th scope="col">Rating</th></tr>
        </thead>
        <tbody>
          <tr><th scope="row">Morning</th><td><st-light-rating level="low" text="Low" /></td></tr>
          <tr><th scope="row">Midday</th><td><st-light-rating level="medium" text="Medium" /></td></tr>
          <tr><th scope="row">Afternoon</th><td><st-light-rating level="medium" text="Medium" /></td></tr>
          <tr><th scope="row">Golden hour</th><td><st-light-rating level="strong" text="Strong" /></td></tr>
          <tr><th scope="row">Blue hour</th><td><st-light-rating level="none" text="None" /></td></tr>
        </tbody>
      </table>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "In a spot's light table each rating is read with its row header, which names the time of day.",
      },
    },
  },
};
