import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PropertyCardComponent } from '../../components/property-card.component';
import { Property } from '../../models/property.model';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PropertyService } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, PropertyCardComponent, RouterModule, MatButtonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];

  searchTerm: string = '';
  selectedType: string = '';
  propertyTypes: string[] = ['apartman', 'ház', 'lakás', 'üzlet']; // módosítsd a saját típusaid szerint

  minPrice?: number;
  maxPrice?: number;
  minSize?: number;
  maxSize?: number;

  isLoading = true;
  isLoggedIn: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private propertyService: PropertyService,
    private dialog: MatDialog,
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.propertyService.getProperties().subscribe(props => {
      this.properties = props;
      this.filteredProperties = [...this.properties];
      this.isLoading = false;
    });
  }

  applyFilters() {
    this.filteredProperties = this.properties.filter(p => {
      const matchesSearch = this.searchTerm
        ? p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          p.location.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      const matchesType = this.selectedType ? p.type === this.selectedType : true;

      const matchesMinPrice = this.minPrice != null ? p.price >= this.minPrice : true;
      const matchesMaxPrice = this.maxPrice != null ? p.price <= this.maxPrice : true;

      const matchesMinSize = this.minSize != null ? p.size >= this.minSize : true;
      const matchesMaxSize = this.maxSize != null ? p.size <= this.maxSize : true;

      return matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice && matchesMinSize && matchesMaxSize;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.snackBar.open('Sikeres kijelentkezés!', '', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        horizontalPosition: 'right',
        verticalPosition: 'bottom'
      });
    });
  }

  onLike(propertyId: string) {
    console.log('Kedvenc lett: ', propertyId);
  }
}
