import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormDemandeComponent } from './form-demande/form-demande.component';
import { ListDemandeComponent } from './list-demande/list-demande.component';

@Component({
	selector: 'app-demande-rv',
	standalone: true,
	imports: [CommonModule, FormDemandeComponent, ListDemandeComponent],
	templateUrl: './demande-rv.component.html',
	styleUrls: ['./demande-rv.component.css']
})
export class DemandeRvComponent {

}
