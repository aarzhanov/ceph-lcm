import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter, ViewContainerRef,
  ViewChild, Inject, forwardRef, Injectable, Host, ComponentRef, SimpleChanges } from '@angular/core';

import { DataService, pagedResult } from '../services/data';
import { ErrorService } from '../services/error';
import { WizardService } from '../services/wizard';
import { BaseModel, Playbook, Cluster, Server, PlaybookConfiguration, PermissionGroup, Hint } from '../models';
import globals = require('../services/globals');

var formatJSON = require('format-json');

// Transpiler component responsible for step visibility
// Every wizard step should be wrapped into the <step> tag
@Component({
  selector: 'step',
  template: `<div *ngIf="isSelected()"><h1>{{title}}</h1><ng-content></ng-content></div>`
})
export class WizardStepContainer {
  @Input() title: string = '';
  private activeStep: ComponentRef<any>;

  isSelected(): boolean {
    return _.get(this.activeStep, 'instance.stepContainer.title') === this.title;
  }

  constructor(wizard: WizardService) {
    wizard.currentStep.subscribe((activeStep: ComponentRef<any>) => {
      this.activeStep = activeStep;
    });
  }
}


// Base wizard step class
export class WizardStepBase {
  @ViewChild(WizardStepContainer) stepContainer: WizardStepContainer;
  model: BaseModel;

  initModelProperty(key: string, defaultValue: any) {
    if (!_.get(this.model, key)) {
      _.set(this.model, key, defaultValue);
    }
  }

  init() {}

  getSharedData(key: string, defaultValue?: any): any {
    return _.get(this.wizard.sharedData, key, defaultValue);
  }

  setSharedData(key: string, value: any) {
    this.wizard.sharedData[key] = value;
    this.wizard.sharedDataUpdated.emit(key);
  }

  isShownInDeck(): boolean {
    return true;
  }

  isValid(): boolean {
    return true;
  }

  constructor(private wizard: WizardService) {
    this.init();
  }

  ngDoCheck() {
    this.wizard.model.emit(this.model);
  }
}
