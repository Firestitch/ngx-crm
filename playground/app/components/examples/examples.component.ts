import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsExampleModule } from '@firestitch/example';
import { LeadsComponent } from '../leads/leads.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsExampleModule, LeadsComponent],
})
export class ExamplesComponent {
}
  
