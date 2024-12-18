import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPtoComponent } from './systems.component';

describe('ViewPtoComponent', () => {
  let component: ViewPtoComponent;
  let fixture: ComponentFixture<ViewPtoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPtoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewPtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
