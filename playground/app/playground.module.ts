import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';


import { FS_API_REQUEST_INTERCEPTOR } from '@firestitch/api';
import { FS_ATTRIBUTE_CONFIG, FsAttributeModule } from '@firestitch/attribute';
import { FsExampleModule } from '@firestitch/example';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsMessageModule } from '@firestitch/message';
import { FsTabsModule } from '@firestitch/tabs';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsCrmLeadsComponent } from '../../src/app/components/leads/leads.component';
import { FsCrmLeadsModule } from '../../src/app/modules/crm-leads';
import { FsCrmLeadModule } from '../../src/public_api';

import { AppComponent } from './app.component';
import {
  ExamplesComponent,
  LeadsComponent,
} from './components';
import { LeadColumnComponent } from './components/leads/components/lead-column';
import { LeadSecondaryContainerComponent } from './components/leads/components/lead-secondary-container/lead-secondary-container.component';
import { LeadTabComponent } from './components/leads/components/lead-tab/lead-tab.component';
import { attributeConfigFactory } from './helpers/attribute-config-factory';
import { ApiInterceptorFactory } from './interceptors';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    FsMessageModule.forRoot(),
    FsExampleModule.forRoot(),
    FsAttributeModule.forRoot(),
    RouterModule.forRoot(routes),
    FsCrmLeadsModule.forRoot({
      columns: [
        {
          title: 'Custom column',
          component: LeadColumnComponent,
        },
      ],
    }),
    FsCrmLeadModule.forRoot({
      secondaryContainer: {
        component: LeadSecondaryContainerComponent,
      },
      tabs: [
        {
          label: 'Custom tab',
          component: LeadTabComponent,
        },
      ],
    }),
    FsHtmlEditorModule.forRoot({
      activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
    }),
    FsTabsModule.forRoot(),
    FsCrmLeadsComponent,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    LeadsComponent,
  ],
  providers: [
    {
      provide: FS_ATTRIBUTE_CONFIG,
      useFactory: attributeConfigFactory,
    },
    {
      provide: FS_API_REQUEST_INTERCEPTOR,
      useFactory: ApiInterceptorFactory,
      deps: [Injector],
    },
  ],
})
export class PlaygroundModule {
}
