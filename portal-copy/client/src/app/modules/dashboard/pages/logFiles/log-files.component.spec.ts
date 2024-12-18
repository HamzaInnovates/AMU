import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApproveAttendanceComponent } from './log-files.component';

describe('ApproveAttendanceComponent', () => {
  let component: ApproveAttendanceComponent;
  let fixture: ComponentFixture<ApproveAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApproveAttendanceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ApproveAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
