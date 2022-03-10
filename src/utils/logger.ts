// Logger Helper
//////////////////////////////////////////////////////

import { paddy } from '@/utils/utilities';

// VUE_APP_DEBUG in .env
const debug: boolean =
  process.env.NODE_ENV === 'production'
    ? false
    : Number(process.env.VUE_APP_DEBUG) === 1
    ? true
    : false;

// Manualy ckeck the modules by names
const namespacesOn: string | string[] = ['Helper', 'Preloader'];

export default class Logger {
  private _counter = 0;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  public log(namespace: string, ...messages: any): void {
    if (debug && namespacesOn.length > 0 && namespacesOn.includes(namespace)) {
      ++this._counter;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages.forEach((message: any, index: number) => {
        try {
          console.log(
            `${paddy(this._counter)}.${paddy(
              index + 1,
            )} / Logger.log / ${namespace}: `,
            JSON.parse(JSON.stringify(message)),
          );
        } catch (err) {
          console.log(
            `${paddy(this._counter)}.${paddy(
              index + 1,
            )} / Logger.log / ${namespace}: `,
            message,
          );
        }
      });
    }
  }
}
