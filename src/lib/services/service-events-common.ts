import { Subject } from 'rxjs';

export class CommonServiceEvents {
  protected _error = new Subject<string>();
  get error() {
    return this._error.asObservable();
  }
}
