import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsCrmLeadsComponent } from '../../../../src/app/components/leads/leads.component';


@Component({
    selector: 'app-leads',
    templateUrl: './leads.component.html',
    styleUrls: ['./leads.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsCrmLeadsComponent],
})
export class LeadsComponent {

}
