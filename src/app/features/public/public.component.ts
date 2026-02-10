import { Component } from '@angular/core';
import { HeaderPublicComponent } from '../../layouts/public/header-public/header-public.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [HeaderPublicComponent, RouterOutlet, CommonModule],
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.css']
})
export class PublicComponent {

}
