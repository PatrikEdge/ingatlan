import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { switchMap, tap, catchError, map } from 'rxjs/operators';
import { CommonModule, NgIf, NgForOf } from '@angular/common';

import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favourite.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { Favorite } from '../../models/favourite.model';

import { PropertyCardComponent } from '../../components/property-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    PropertyCardComponent
  ]
})
export class FavoritesComponent implements OnInit {
  favoriteProperties$: Observable<Property[]> = of([]);

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.favoriteProperties$ = this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user?.id) return of([]);  // nincs bejelentkezve
        return this.favoriteService.getFavoritesByUser(user.id).pipe(
          catchError(err => {
            console.error('Hiba kedvencek lekérésekor:', err);
            return of([]);
          })
        );
      }),
      switchMap((favorites: Favorite[]) => {
        if (!favorites.length) return of([]);
        const propertyObservables = favorites.map(fav =>
          this.propertyService.getPropertyById(fav.propertyId).pipe(
            tap(property => console.log('Lekért property:', property)),
            catchError(err => {
              console.error(`Hiba property (${fav.propertyId}) lekérésekor:`, err);
              return of(null);  // null-t adunk vissza, hogy a forkJoin ne omoljon össze
            })
          )
        );
        return forkJoin(propertyObservables).pipe(
          map(properties => properties.filter(p => p !== null) as Property[])
        );
      }),
      catchError(err => {
        console.error('Általános hiba:', err);
        return of([]);
      })
    );
  }
}
