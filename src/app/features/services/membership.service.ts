import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


const API = 'http://localhost:8080/api';

export interface MembershipStatus {
  status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'PENDING';
  expiresAt: string;
  daysLeft: number;
  isTrial: boolean;
  isActive: boolean;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class MembershipService {
  private http = inject(HttpClient);

  getStatus(): Observable<MembershipStatus | null> {
    return this.http
      .get<MembershipStatus>(`${API}/membership/status`)
      .pipe(catchError(() => of(null)));
  }

  checkout(): Observable<{ checkoutUrl: string }> {
    return this.http.post<{ checkoutUrl: string }>(`${API}/membership/checkout`, {});
  }

  startTrial(): Observable<MembershipStatus> {
    return this.http.post<MembershipStatus>(`${API}/membership/start-trial`, {});
  }
}
