import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ApplyLeaveComponent } from './features/apply-leave/apply-leave.component';
import { ApprovalsComponent } from './features/approvals/approvals.component';
import { LeaveTypesComponent } from './features/leave-types/leave-types.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'apply', component: ApplyLeaveComponent },
  { path: 'approvals', component: ApprovalsComponent },
  { path: 'leave-types', component: LeaveTypesComponent }
];
