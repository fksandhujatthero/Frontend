import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { LeaveApiService } from '../../core/services/leave-api.service';
import { LeaveBalance, LeaveRequest, LeaveType } from '../../core/models/leave.models';

@Component({
  selector: 'app-dashboard', standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DropdownModule],
  template: `
  <section class="grid">
    <div class="card"><h3>Total Available Balance</h3><h2>{{ totalAvailable | number:'1.0-2' }} days</h2></div>
    <div class="card" *ngFor="let b of balances"><b>{{ b.leaveTypeName }}</b><p>{{ b.availableDays }} available / {{ b.allocatedDays }} allocated</p><progress [value]="b.availableDays" [max]="b.allocatedDays || 1"></progress></div>
  </section>
  <section class="card">
    <h2>Leave Request History</h2>
    <div class="actions">
      <select [(ngModel)]="status" (change)="load()"><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
      <select [(ngModel)]="leaveTypeId" (change)="load()"><option value="">All types</option><option *ngFor="let t of types" [value]="t.id">{{t.name}}</option></select>
      <button pButton label="Export CSV" icon="pi pi-download" (click)="exportCsv()"></button>
    </div>
    <p-table [value]="requests" [paginator]="true" [rows]="8" [sortMode]="'multiple'">
      <ng-template pTemplate="header"><tr><th pSortableColumn="leaveTypeName">Type <p-sortIcon field="leaveTypeName"></p-sortIcon></th><th pSortableColumn="startDate">Start</th><th>End</th><th>Days</th><th>Status</th><th>Reason</th></tr></ng-template>
      <ng-template pTemplate="body" let-r><tr><td>{{r.leaveTypeName}}</td><td>{{r.startDate | date}}</td><td>{{r.endDate | date}}</td><td>{{r.daysRequested}}</td><td>{{r.status}}</td><td>{{r.reason}}</td></tr></ng-template>
    </p-table>
  </section>`
})
export class DashboardComponent implements OnInit {
  requests: LeaveRequest[] = []; balances: LeaveBalance[] = []; types: LeaveType[] = []; status = ''; leaveTypeId = '';
  constructor(private api: LeaveApiService) {}
  get totalAvailable() { return this.balances.reduce((sum, b) => sum + Number(b.availableDays), 0); }
  ngOnInit() { this.api.types().subscribe(x => this.types = x); this.load(); this.api.balances().subscribe(x => this.balances = x); }
  load() { this.api.getRequests({ employeeId: 1, status: this.status, leaveTypeId: this.leaveTypeId ? Number(this.leaveTypeId) : undefined }).subscribe(x => this.requests = x); }
  exportCsv() { const rows = [['Type','Start','End','Days','Status','Reason'], ...this.requests.map(r => [r.leaveTypeName, r.startDate, r.endDate, String(r.daysRequested), r.status, r.reason])]; const csv = rows.map(r => r.map(v => `"${String(v).replaceAll('"','""')}"`).join(',')).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'leave-history.csv'; a.click(); }
}
