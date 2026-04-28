export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export interface LeaveType { id: number; name: string; defaultDays: number; isAccrued: boolean; monthlyAccrualRate: number; isActive: boolean; }
export interface LeaveBalance { employeeId: number; leaveTypeId: number; leaveTypeName: string; allocatedDays: number; usedDays: number; pendingDays: number; availableDays: number; }
export interface LeaveRequest { id: number; employeeId: number; employeeName: string; leaveTypeId: number; leaveTypeName: string; startDate: string; endDate: string; daysRequested: number; reason: string; status: LeaveStatus; rejectionComment?: string; }
export interface ApiResult<T> { success: boolean; message: string; data: T; }
