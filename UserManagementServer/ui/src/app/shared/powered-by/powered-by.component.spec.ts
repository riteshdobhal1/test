import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoweredByComponent } from './powered-by.component';
import { AdminService } from 'src/app/services/admin/admin.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('PoweredByComponent', () => {
  let component: PoweredByComponent;
  let fixture: ComponentFixture<PoweredByComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ PoweredByComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AdminService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoweredByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
