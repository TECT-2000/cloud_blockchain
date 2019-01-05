/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PVService } from './PV.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-pv',
  templateUrl: './PV.component.html',
  styleUrls: ['./PV.component.css'],
  providers: [PVService]
})
export class PVComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  pvId = new FormControl('', Validators.required);
  nbVotants = new FormControl('', Validators.required);
  owner = new FormControl('', Validators.required);
  listeDesVoix = new FormControl('', Validators.required);
  nomBureau = new FormControl('', Validators.required);

  constructor(public servicePV: PVService, fb: FormBuilder) {
    this.myForm = fb.group({
      pvId: this.pvId,
      nbVotants: this.nbVotants,
      owner: this.owner,
      listeDesVoix: this.listeDesVoix,
      nomBureau: this.nomBureau
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePV.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.projet.PV',
      'pvId': this.pvId.value,
      'nbVotants': this.nbVotants.value,
      'owner': this.owner.value,
      'listeDesVoix': this.listeDesVoix.value,
      'nomBureau': this.nomBureau.value
    };

    this.myForm.setValue({
      'pvId': null,
      'nbVotants': null,
      'owner': null,
      'listeDesVoix': null,
      'nomBureau': null
    });

    return this.servicePV.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'pvId': null,
        'nbVotants': null,
        'owner': null,
        'listeDesVoix': null,
        'nomBureau': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.example.projet.PV',
      'nbVotants': this.nbVotants.value,
      'owner': this.owner.value,
      'listeDesVoix': this.listeDesVoix.value,
      'nomBureau': this.nomBureau.value
    };

    return this.servicePV.updateAsset(form.get('pvId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePV.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePV.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'pvId': null,
        'nbVotants': null,
        'owner': null,
        'listeDesVoix': null,
        'nomBureau': null
      };

      if (result.pvId) {
        formObject.pvId = result.pvId;
      } else {
        formObject.pvId = null;
      }

      if (result.nbVotants) {
        formObject.nbVotants = result.nbVotants;
      } else {
        formObject.nbVotants = null;
      }

      if (result.owner) {
        formObject.owner = result.owner;
      } else {
        formObject.owner = null;
      }

      if (result.listeDesVoix) {
        formObject.listeDesVoix = result.listeDesVoix;
      } else {
        formObject.listeDesVoix = null;
      }

      if (result.nomBureau) {
        formObject.nomBureau = result.nomBureau;
      } else {
        formObject.nomBureau = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'pvId': null,
      'nbVotants': null,
      'owner': null,
      'listeDesVoix': null,
      'nomBureau': null
      });
  }

}
