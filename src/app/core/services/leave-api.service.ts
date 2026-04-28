import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult, LeaveBalance, LeaveRequest, LeaveType } from '../models/leave.models';

@Injectable({ providedIn: 'root' })
export class LeaveApiService {
  private readonly baseUrl = 'https://localhost:56765/api';
  constructor(private http: HttpClient) {}

  getRequests(filters: Record<string, string | number | undefined> = {}): Observable<LeaveRequest[]> {
    let params = new HttpParams();
    Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== '') params = params.set(key, String(value)); });
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/leave-requests`, { params });
  }
  apply(payload: { employeeId: number; leaveTypeId: number; startDate: string; endDate: string; reason: string }): Observable<ApiResult<LeaveRequest>> {
    return this.http.post<ApiResult<LeaveRequest>>(`${this.baseUrl}/leave-requests`, payload);
  }
  approve(id: number): Observable<ApiResult<LeaveRequest>> { return this.http.post<ApiResult<LeaveRequest>>(`${this.baseUrl}/leave-requests/${id}/approve`, {}); }
  reject(id: number, comment: string): Observable<ApiResult<LeaveRequest>> { return this.http.post<ApiResult<LeaveRequest>>(`${this.baseUrl}/leave-requests/${id}/reject`, { comment }); }
  bulkApprove(ids: number[]): Observable<ApiResult<LeaveRequest[]>> { return this.http.post<ApiResult<LeaveRequest[]>>(`${this.baseUrl}/leave-requests/bulk-approve`, { requestIds: ids }); }
  bulkReject(ids: number[], comment: string): Observable<ApiResult<LeaveRequest[]>> { return this.http.post<ApiResult<LeaveRequest[]>>(`${this.baseUrl}/leave-requests/bulk-reject`, { requestIds: ids, comment }); }
  balances(employeeId = 1): Observable<LeaveBalance[]> { return this.http.get<LeaveBalance[]>(`${this.baseUrl}/leave-balances/employee/${employeeId}`); }
  settle(payload: { employeeId: number; leaveTypeId: number; adjustmentDays: number; reason: string }): Observable<ApiResult<unknown>> { return this.http.post<ApiResult<unknown>>(`${this.baseUrl}/leave-balances/settlements`, payload); }
  types(): Observable<LeaveType[]> { return this.http.get<LeaveType[]>(`${this.baseUrl}/leave-types`); }
  saveType(payload: Partial<LeaveType>): Observable<LeaveType> { return payload.id ? this.http.put<LeaveType>(`${this.baseUrl}/leave-types/${payload.id}`, payload) : this.http.post<LeaveType>(`${this.baseUrl}/leave-types`, payload); }
}
