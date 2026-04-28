import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { LeaveApiService } from '../../core/services/leave-api.service';
import { LeaveType } from '../../core/models/leave.models';

@Component({ selector: 'app-leave-types', standalone: true, imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule], template: `
<section class="grid">
<div class="card"><h2>Leave Types Management</h2><form class="form" [formGroup]="form" (ngSubmit)="save()"><input formControlName="name" placeholder="Name"><input type="number" formControlName="defaultDays" placeholder="Default days"><label><input type="checkbox" formControlName="isAccrued"> Is Accrued</label><input type="number" step="0.01" formControlName="monthlyAccrualRate" placeholder="Monthly accrual rate"><label><input type="checkbox" formControlName="isActive"> Active</label><button pButton label="Save Type"></button></form></div>
<div class="card"><h2>Manual Settlement</h2><form class="form" [formGroup]="settlement" (ngSubmit)="settle()"><select formControlName="leaveTypeId"><option *ngFor="let t of types" [value]="t.id">{{t.name}}</option></select><input type="number" formControlName="adjustmentDays" placeholder="Adjustment days"><input formControlName="reason" placeholder="Reason"><button pButton label="Apply Adjustment"></button></form></div>
</section>
<section class="card"><h2>Existing Types</h2><table><tr><th>Name</th><th>Default</th><th>Accrued</th><th>Rate</th><th>Active</th><th></th></tr><tr *ngFor="let t of types"><td>{{t.name}}</td><td>{{t.defaultDays}}</td><td>{{t.isAccrued}}</td><td>{{t.monthlyAccrualRate}}</td><td>{{t.isActive}}</td><td><button pButton label="Edit" (click)="edit(t)"></button></td></tr></table></section>` })
export class LeaveTypesComponent implements OnInit {
  types: LeaveType[] = [];
  form = this.fb.group({ id: [undefined as number | undefined], name: ['', Validators.required], defaultDays: [0, Validators.required], isAccrued: [false], monthlyAccrualRate: [0], isActive: [true] });
  settlement = this.fb.group({ employeeId: [1], leaveTypeId: [0, Validators.required], adjustmentDays: [0, Validators.required], reason: ['', Validators.required] });
  constructor(private fb: FormBuilder, private api: LeaveApiService, private toast: MessageService) {}
  ngOnInit() { this.load(); }
  load() { this.api.types().subscribe(x => { this.types = x; if (x[0]) this.settlement.patchValue({ leaveTypeId: x[0].id }); }); }
  edit(t: LeaveType) { this.form.patchValue(t); }
 save() {
  const value = this.form.getRawValue();

  const payload = {
    id: value.id ?? undefined,
    name: value.name ?? '',
    defaultDays: value.defaultDays ?? 0,
    isAccrued: value.isAccrued ?? false,
    monthlyAccrualRate: value.monthlyAccrualRate ?? 0,
    isActive: value.isActive ?? true
  };

  this.api.saveType(payload).subscribe(() => {
    this.toast.add({ severity: 'success', summary: 'Saved', detail: 'Leave type saved' });

    this.form.reset({
      id: undefined,
      name: '',
      defaultDays: 0,
      monthlyAccrualRate: 0,
      isAccrued: false,
      isActive: true
    });

    this.load();
  });
}
  settle() { this.api.settle(this.settlement.getRawValue() as any).subscribe(() => this.toast.add({severity:'success', summary:'Adjusted', detail:'Balance settlement saved'})); }
}
