import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';

import { DisplayApiError } from '@firestitch/api';
import { RouteSubject } from '@firestitch/core';

import { Observable } from 'rxjs';

import { HttpContext } from '@angular/common/http';

import { DocumentRequestData } from '../data';


@Injectable()
export class DocumentRequestResolve  {

  constructor(
    private _documentRequestData: DocumentRequestData,
  ) { }

  public resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const routeSubject = new RouteSubject();

    return routeSubject.observe(
      this._documentRequestData.get(route.params.guid,
        { context: new HttpContext().set(DisplayApiError, false) },
      ),
    );
  }
}
