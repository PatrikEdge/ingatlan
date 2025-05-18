import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule,MatSnackBarModule,MatInputModule,MatFormFieldModule,MatButtonModule,MatCardModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']  // itt volt a hiba
})
export class AppComponent {
  title = 'ingatlan-kereso';
}
