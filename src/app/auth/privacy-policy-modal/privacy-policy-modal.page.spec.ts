import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrivacyPolicyModalPage } from './privacy-policy-modal.page';

describe('PrivacyPolicyModalPage', () => {
  let component: PrivacyPolicyModalPage;
  let fixture: ComponentFixture<PrivacyPolicyModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyPolicyModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
