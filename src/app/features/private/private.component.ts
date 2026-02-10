import { Component } from '@angular/core';
import { HeaderComponent } from '../../layouts/private/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-private',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.css']
})
export class PrivateComponent {

}
