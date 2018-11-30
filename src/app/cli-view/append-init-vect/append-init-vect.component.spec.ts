import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppendInitVectComponent } from './append-init-vect.component';

describe('AppendInitVectComponent', () => {
  let component: AppendInitVectComponent;
  let fixture: ComponentFixture<AppendInitVectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppendInitVectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppendInitVectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
