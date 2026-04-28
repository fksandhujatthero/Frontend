import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { LeaveApiService } from '../../core/services/leave-api.service';
import { LeaveRequest } from '../../core/models/leave.models';

@Component({ selector: 'app-approvals', standalone: true, imports: [CommonModule, FormsModule, TableModule, ButtonModule], template: `
<section class="card"><h2>Pending Approvals</h2>
<div class="actions"><button pButton label="Bulk Approve" (click)="bulkApprove()"></button><input [(ngModel)]="bulkComment" placeholder="Bulk rejection comment"><button pButton label="Bulk Reject" severity="danger" (click)="bulkReject()"></button></div>
<p-table [value]="pending" [(selection)]="selected" dataKey="id">
  <ng-template pTemplate="header"><tr><th style="width:3rem"><p-tableHeaderCheckbox></p-tableHeaderCheckbox></th><th>Employee</th><th>Type</th><th>Dates</th><th>Days</th><th>Reason</th><th>Actions</th></tr></ng-template>
  <ng-template pTemplate="body" let-r><tr><td><p-tableCheckbox [value]="r"></p-tableCheckbox></td><td>{{r.employeeName}}</td><td>{{r.leaveTypeName}}</td><td>{{r.startDate | date}} - {{r.endDate | date}}</td><td>{{r.daysRequested}}</td><td>{{r.reason}}</td><td class="actions"><button pButton label="Approve" (click)="approve(r.id)"></button><input #c placeholder="Comment"><button pButton label="Reject" severity="danger" (click)="reject(r.id, c.value)"></button></td></tr></ng-template>
</p-table></section>` })
export class ApprovalsComponent implements OnInit {
  pending: LeaveRequest[] = []; selected: LeaveRequest[] = []; bulkComment = '';
  constructor(private api: LeaveApiService, private toast: MessageService) {}
  ngOnInit() { this.load(); }
  load() { this.api.getRequests({ status: 'Pending' }).subscribe(x => this.pending = x); }
  approve(id: number) { this.api.approve(id).subscribe({ next: r => { this.toast.add({severity:'success', summary:'Approved', detail:r.message}); this.load(); }, error: e => this.toast.add({severity:'error', summary:'Error', detail:e.error?.message}) }); }
  reject(id: number, comment: string) { this.api.reject(id, comment).subscribe({ next: r => { this.toast.add({severity:'success', summary:'Rejected', detail:r.message}); this.load(); }, error: e => this.toast.add({severity:'error', summary:'Error', detail:e.error?.message}) }); }
  bulkApprove() { this.api.bulkApprove(this.selected.map(x => x.id)).subscribe(() => { this.toast.add({severity:'success', summary:'Done', detail:'Selected requests approved'}); this.load(); }); }
  bulkReject() { this.api.bulkReject(this.selected.map(x => x.id), this.bulkComment).subscribe(() => { this.toast.add({severity:'success', summary:'Done', detail:'Selected requests rejected'}); this.load(); }); }
}
