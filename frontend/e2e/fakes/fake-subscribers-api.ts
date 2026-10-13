import { Page, Route } from '@playwright/test';

/** The subscribe endpoint answers every request with this status. Returns the JSON body of every request it receives. */
export async function givenSubscribeAnswers(page: Page, status: number): Promise<unknown[]> {
  const received: unknown[] = [];
  await page.route(
    (url) => url.pathname === '/api/subscribers',
    (route: Route) => {
      received.push(route.request().postDataJSON());
      return route.fulfill({ status, json: status === 200 ? {} : { message: 'failed' } });
    }
  );
  return received;
}
