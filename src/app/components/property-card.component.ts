import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Property } from '../models/property.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FavoriteService } from '../services/favourite.service';
import { AuthService } from '../services/auth.service';
import { Favorite } from '../models/favourite.model';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InterestService } from '../services/interest.service';
import { Interest } from '../models/interest.model';
import { MatDialog } from '@angular/material/dialog';
import { InterestDialogComponent } from '../components/interest-dialog.component';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './property-card.component.html',
})
export class PropertyCardComponent implements OnInit {
  @Input() property!: Property;
  @Output() liked = new EventEmitter<string>();
  @Output() interested = new EventEmitter<Property>();

  expressInterest() {
    if (!this.currentUserId) {
      this.snackBar.open('Kérjük jelentkezz be az érdeklődéshez!', 'OK', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
      });
      return;  // ha nincs userId, itt kilépünk
    }
  
    const dialogRef = this.dialog.open(InterestDialogComponent, {
      width: '400px',
      data: { title: this.property.title },
    });
  
    dialogRef.afterClosed().subscribe(message => {
      if (message !== undefined && this.currentUserId) {
        const interest: Interest = {
          userId: this.currentUserId,
          propertyId: this.property.id,
          propertyTitle: this.property.title,   // ide kell az ingatlan neve
          message: message,
          timestamp: new Date()
        };
    
        this.interestService.sendInterest(interest)
          .then(() => {
            this.snackBar.open('Érdeklődés sikeresen elküldve!', 'OK', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          })
          .catch(error => {
            console.error('Hiba az érdeklődés során:', error);
            this.snackBar.open('Hiba történt az érdeklődés elküldésekor.', 'OK', {
              duration: 3000,
              panelClass: ['snackbar-error'],
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            });
          });
      }
    });
  }      

  isFavorite = false;
  favoriteId?: string;
  currentUserId?: string;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private interestService: InterestService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.checkIfFavorite();
      } else {
        this.isFavorite = false;
        this.favoriteId = undefined;
      }
    });
  }

  checkIfFavorite() {
    if (!this.currentUserId) return;

    this.favoriteService.getFavoriteByUserAndProperty(this.currentUserId, this.property.id)
      .subscribe(fav => {
        this.isFavorite = !!fav;
        this.favoriteId = fav?.id;
      });
  }

  toggleFavorite() {
    if (!this.currentUserId) {
      alert('Kérjük jelentkezz be, hogy kedvencet adhass hozzá!');
      return;
    }
  
    if (this.isFavorite && this.favoriteId) {
      this.favoriteService.removeFavorite(this.favoriteId)
        .then(() => {
          this.isFavorite = false;
          this.favoriteId = undefined;
          this.liked.emit(this.property.id);
        })
        .catch(err => {
          console.error('Hiba az eltávolításkor:', err);
        });
    } else {
      const newFavorite: Favorite = {
        id: '', // majd a service generálja
        userId: this.currentUserId,
        propertyId: this.property.id,
        addedAt: new Date()
      };
  
      this.favoriteService.addFavorite(newFavorite)
        .then(() => {
          this.isFavorite = true;
          this.liked.emit(this.property.id);
          this.snackBar.open('Sikeresen a kedvencekhez adva!', 'OK', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'bottom'
          });
        })
        .catch(err => {
          console.error('Hiba a hozzáadáskor:', err);
        });
    }
  }
}
