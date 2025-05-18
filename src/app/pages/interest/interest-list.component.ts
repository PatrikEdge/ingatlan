import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InterestService } from '../../services/interest.service';
import { AuthService } from '../../services/auth.service';
import { Interest } from '../../models/interest.model';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Timestamp } from 'firebase/firestore';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-interest-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  templateUrl: './interest-list.component.html',
  styleUrls: ['./interest-list.component.scss']
})
export class InterestListComponent implements OnInit {
  interests: Interest[] = [];
  isLoading = true;
  currentUserId?: string;

  constructor(
    private interestService: InterestService,
    private authService: AuthService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.fetchInterests();
      }
    });
  }

  fetchInterests() {
    if (!this.currentUserId) return;
  
    this.interestService.getInterestsByUser(this.currentUserId).subscribe((data: Interest[]) => {
      // timestamp konvertálás
      this.interests = data.map(i => ({
        ...i,
        timestamp: i.timestamp instanceof Timestamp ? i.timestamp.toDate() : i.timestamp
      }));
  
      // lekérdezed az ingatlan címeket
      this.interests.forEach(interest => {
        this.propertyService.getPropertyById(interest.propertyId).subscribe(property => {
          interest.propertyTitle = property?.title || 'Ismeretlen ingatlan';
        });
      });
  
      this.isLoading = false;
    });
  }
}
