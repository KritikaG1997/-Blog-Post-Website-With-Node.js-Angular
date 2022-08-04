import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllusersDetailsComponent } from './allusers-details.component';

describe('AllusersDetailsComponent', () => {
  let component: AllusersDetailsComponent;
  let fixture: ComponentFixture<AllusersDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllusersDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllusersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
