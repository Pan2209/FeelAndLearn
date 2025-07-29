import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LearnAlphabetPage } from './learn-alphabet.page';

describe('LearnAlphabetPage', () => {
  let component: LearnAlphabetPage;
  let fixture: ComponentFixture<LearnAlphabetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnAlphabetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
