import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: true,
    imports: [
      ReactiveFormsModule,
      MatCardModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      CommonModule
    ],
  })
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUserId!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: [''], // opcionális, csak ha jelszót akarsz változtatni
    });

    this.authService.getCurrentUser().subscribe(user => {
      if (user && user.id) {
        this.currentUserId = user.id;
        this.loadUserData(user.id);
      }
    });
  }

  loadUserData(userId: string) {
    this.userService.getUserById(userId).subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        });
      }
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    const updateData: Partial<User> = {
      firstName: this.profileForm.get('firstName')?.value,
      lastName: this.profileForm.get('lastName')?.value,
    };

    // Ha jelszót is szeretnél kezelni, itt külön logikát kell írni

    this.userService.updateUser(this.currentUserId, updateData)
      .then(() => alert('Profil sikeresen frissítve!'))
      .catch(err => alert('Hiba történt: ' + err.message));
  }
}
