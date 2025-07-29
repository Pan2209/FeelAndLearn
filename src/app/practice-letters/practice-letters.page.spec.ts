import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticeLettersPage } from './practice-letters.page';

describe('PracticeLettersPage', () => {
  let component: PracticeLettersPage;
  let fixture: ComponentFixture<PracticeLettersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeLettersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
