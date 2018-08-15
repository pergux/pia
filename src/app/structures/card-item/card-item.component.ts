import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Structure } from '../structure.model';

import { ModalsService } from 'app/modals/modals.service';
import { PiaService } from 'app/entry/pia.service';

@Component({
  selector: 'app-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss', './card-item_edit.component.scss',
    './card-item_doing.component.scss'],
})
export class CardItemComponent implements OnInit {
  @Input() structure: any;
  @Input() previousStructure: any;
  structureForm: FormGroup;

  @ViewChild('structureName') private structureName: ElementRef;
  @ViewChild('structureSectorName') private structureSectorName: ElementRef;

  constructor(private router: Router,
              private _modalsService: ModalsService,
              public _piaService: PiaService) { }

  ngOnInit() {
    this.structureForm = new FormGroup({
      id: new FormControl(this.structure.id),
      name: new FormControl({ value: this.structure.name, disabled: false }),
      sector_name: new FormControl({ value: this.structure.sector_name, disabled: false })
    });
  }

  /**
   * Focuses Structure name field.
   * @memberof CardItemComponent
   */
  structureNameFocusIn() {
    this.structureForm.controls['name'].enable();
    this.structureName.nativeElement.focus();
  }

  /**
   * Disables Structure name field and saves data.
   * @memberof CardItemComponent
   */
  structureNameFocusOut() {
    let userText = this.structureForm.controls['name'].value;
    if (userText) {
      userText = userText.replace(/^\s+/, '').replace(/\s+$/, '');
    }
    if (userText !== '') {
      const structure = new Structure();
      structure.get(this.structureForm.value.id).then(() => {
        structure.name = this.structureForm.value.name;
        structure.update();
      });
    }
  }

  /**
   * Focuses Structure author name field.
   * @memberof CardItemComponent
   */
  structureSectorNameFocusIn() {
    this.structureSectorName.nativeElement.focus();
  }

  /**
   * Disables Structure author name field and saves data.
   * @memberof CardItemComponent
   */
  structureSectorNameFocusOut() {
    let userText = this.structureForm.controls['sector_name'].value;
    if (userText) {
      userText = userText.replace(/^\s+/, '').replace(/\s+$/, '');
    }
    if (userText !== '') {
      const structure = new Structure();
      structure.get(this.structureForm.value.id).then(() => {
        structure.sector_name = this.structureForm.value.sector_name;
        structure.update();
      });
    }
  }

  /**
   * Deletes a Structure with a given id.
   * @param {string} id - The Structure id.
   * @memberof CardItemComponent
   */
  removePia(id: string) {
    localStorage.setItem('structure-id', id);
    this._modalsService.openModal('modal-remove-structure');
  }

  /**
   * Export a Structure in JSON format.
   * @param {number} id - The Structure id.
   * @memberof CardItemComponent
   */
  export(id: number) {
    this._piaService.exportStructure(id);
  }
}
