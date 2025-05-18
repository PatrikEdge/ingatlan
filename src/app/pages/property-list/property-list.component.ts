import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html'
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  filterForm: FormGroup;

  constructor(private propertyService: PropertyService, private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      minPrice: [''],
      maxPrice: [''],
      minSize: [''],
      maxSize: ['']
    });
  }

  ngOnInit(): void {
    this.loadProperties();

    this.filterForm.valueChanges.subscribe(() => {
      this.loadProperties();
    });
  }

  loadProperties() {
    const filters = {
      minPrice: this.parseNumber(this.filterForm.value.minPrice),
      maxPrice: this.parseNumber(this.filterForm.value.maxPrice),
      minSize: this.parseNumber(this.filterForm.value.minSize),
      maxSize: this.parseNumber(this.filterForm.value.maxSize),
    };

    // Töröljük azokat, amik null értékűek, hogy ne küldjük a filterben
    Object.keys(filters).forEach(key => {
      if (filters[key] === null) {
        delete filters[key];
      }
    });

    this.propertyService.getProperties(filters).subscribe(data => {
      this.properties = data;
    });
  }

  private parseNumber(value: any): number | null {
    const n = Number(value);
    return isNaN(n) ? null : n;
  }

  deleteProperty(id: string) {
    this.propertyService.deleteProperty(id);
  }
}
