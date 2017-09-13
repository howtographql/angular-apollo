import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkItemComponent } from './link-item.component';

describe('LinkItemComponent', () => {
  let component: LinkItemComponent;
  let fixture: ComponentFixture<LinkItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
