import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RvComponent } from './rv.component';

describe('RvComponent', () => {
  let component: RvComponent;
  let fixture: ComponentFixture<RvComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RvComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RvComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
