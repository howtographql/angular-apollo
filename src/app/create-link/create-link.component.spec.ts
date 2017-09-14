import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLinkComponent } from './create-link.component';

describe('CreateLinkComponent', () => {
  let component: CreateLinkComponent;
  let fixture: ComponentFixture<CreateLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
