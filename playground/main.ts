import { enableProdMode, Injector, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_ATTRIBUTE_CONFIG, FsAttributeModule } from '@firestitch/attribute';
import { attributeConfigFactory } from './app/helpers/attribute-config-factory';
import { FS_API_REQUEST_INTERCEPTOR } from '@firestitch/api';
import { ApiInterceptorFactory } from './app/interceptors';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsMessageModule } from '@firestitch/message';
import { FsExampleModule } from '@firestitch/example';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { FsCrmLeadsModule } from '../src/app/modules/crm-leads';
import { LeadColumnComponent } from './app/components/leads/components/lead-column';
import { FsCrmLeadModule } from '../src/public_api';
import { LeadSecondaryContainerComponent } from './app/components/leads/components/lead-secondary-container/lead-secondary-container.component';
import { LeadTabComponent } from './app/components/leads/components/lead-tab/lead-tab.component';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTabsModule } from '@firestitch/tabs';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, FsMessageModule.forRoot(), FsExampleModule.forRoot(), FsAttributeModule.forRoot(), FsCrmLeadsModule.forRoot({
            columns: [
                {
                    title: 'Custom column',
                    component: LeadColumnComponent,
                },
            ],
        }), FsCrmLeadModule.forRoot({
            secondaryContainer: {
                component: LeadSecondaryContainerComponent,
            },
            tabs: [
                {
                    label: 'Custom tab',
                    component: LeadTabComponent,
                },
            ],
        }), FsHtmlEditorModule.forRoot({
            activationKey: '2J1B10dD7F6F5A3F3I3cWHNGGDTCWHId1Eb1Oc1Yh1b2Ld1POkE3D3F3C9A4E5A3G3B2G2==',
        }), FsTabsModule.forRoot()),
        {
            provide: FS_ATTRIBUTE_CONFIG,
            useFactory: attributeConfigFactory,
        },
        {
            provide: FS_API_REQUEST_INTERCEPTOR,
            useFactory: ApiInterceptorFactory,
            deps: [Injector],
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch((err) => console.error(err));

