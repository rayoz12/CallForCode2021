import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CropService } from '../crop.service';

@Component({
  selector: 'app-update-crop',
  templateUrl: './update-crop.component.html',
  styleUrls: ['./update-crop.component.scss']
})
export class UpdateCropComponent implements OnInit {
  searchForm: FormGroup;
  updateForm: FormGroup;

  constructor(private http: HttpClient,
    private service: CropService) { }

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      cropId: new FormControl('', [Validators.required])
    });

    this.updateForm = new FormGroup({
      cropId: new FormControl('', [Validators.required]),
      cropName: new FormControl('', [Validators.required]),
      plantingSeasonFrom: new FormControl('', [Validators.required]),
      plantingSeasonTo: new FormControl('', [Validators.required]),
      harvestTime: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")])
    });
  }

  isFormInvalid() {
    return this.updateForm.invalid;
  }

  isSearchFormInvalid() {
    return this.searchForm.invalid;
  }

  findCrop() {
    const cropData = {
      cropId: this.searchForm.get('cropId'), 
      cropName: 'Crop 1',
      plantingSeasonFrom: 'July',
      plantingSeasonTo: 'Oct',
      harvestTime: 3
    };

    this.updateForm.patchValue(cropData);
  }

  hasCrop() {
    return this.updateForm.valid;
  }

  updateCrop() {
    const crop = {
      _id: this.updateForm.get("cropId").value + '',
      _rev: '',
      type: 'crop',
      name: this.updateForm.get("cropName").value + '',
      planting_season: [this.updateForm.get("plantingSeasonFrom").value + '', this.updateForm.get("plantingSeasonTo").value + ''],
      time_to_harvest: Number.parseInt(this.updateForm.get('harvestTime').value)
    };

    this.service.updateCrop(crop).then(res => {
      console.log('Updated crop', res);
    })
  }
}
