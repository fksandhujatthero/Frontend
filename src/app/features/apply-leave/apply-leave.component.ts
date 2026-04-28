import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs';
import { LeaveApiService } from '../../core/services/leave-api.service';
import { LeaveBalance, LeaveType } from '../../core/models/leave.models';

@Component({ selector: 'app-apply-leave', standalone: true, imports: [CommonModule, ReactiveFormsModule, ButtonModule, CalendarModule], template: `
<section class="card"><h2>Apply for Leave</h2>
<form class="form" [formGroup]="form" (ngSubmit)="submit()">
  <label>Leave Type<select formControlName="leaveTypeId"><option value="">Select</option><option *ngFor="let t of types" [value]="t.id">{{t.name}}</option></select></label>
  <label>Start Date<input type="date" formControlName="startDate"></label>
  <label>End Date<input type="date" formControlName="endDate"></label>
  <label>Reason<textarea rows="4" formControlName="reason"></textarea></label>
  <p class="danger" *ngIf="warning">{{ warning }}</p>
  <button pButton label="Submit Leave Request" [disabled]="form.invalid"></button>
</form></section>` })
export class ApplyLeaveComponent implements OnInit {
  types: LeaveType[] = []; balances: LeaveBalance[] = []; warning = '';
  form = this.fb.group({ employeeId: [1, Validators.required], leaveTypeId: ['', Validators.required], startDate: ['', Validators.required], endDate: ['', Validators.required], reason: ['', [Validators.required, Validators.minLength(5)]] });
  constructor(private fb: FormBuilder, private api: LeaveApiService, private toast: MessageService) {}
  ngOnInit() { const draft = localStorage.getItem('leaveDraft'); if (draft) this.form.patchValue(JSON.parse(draft)); this.api.types().subscribe(x => this.types = x); this.api.balances().subscribe(x => this.balances = x); this.form.valueChanges.pipe(debounceTime(250)).subscribe(v => { localStorage.setItem('leaveDraft', JSON.stringify(v)); this.checkBalance(); }); }
  checkBalance() { const typeId = Number(this.form.value.leaveTypeId); const balance = this.balances.find(b => b.leaveTypeId === typeId); this.warning = balance && balance.availableDays < 3 ? `Low balance warning: ${balance.availableDays} days available.` : ''; }
  submit() { if (this.form.invalid) return; this.api.apply(this.form.getRawValue() as any).subscribe({ next: r => { localStorage.removeItem('leaveDraft'); this.toast.add({ severity: 'success', summary: 'Success', detail: r.message }); this.form.reset({ employeeId: 1 }); }, error: e => this.toast.add({ severity: 'error', summary: 'Error', detail: e.error?.message ?? 'Unable to submit request' }) }); }
}
