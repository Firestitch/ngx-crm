import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentRequestResolve } from './resolvers';
import { DocumentRequestComponent } from './views';


const routes: Routes = [
  {
    path: ':guid',
    resolve: {
      documentRequest: DocumentRequestResolve,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DocumentRequestComponent,
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [DocumentRequestResolve],
})
export class DocumentRequestRoutingModule { }
