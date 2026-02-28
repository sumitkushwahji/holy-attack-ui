import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const environment = {
  apiUrl: 'http://localhost:8080/api'
};

export interface CreateAttackRequest {
  attackerName: string;
  color: string;
  imageUrl?: string;
  message?: string;
  victimName?: string;
  referralAttackId?: string;
}

export interface CreateAttackResponse {
  attackId: string;
  shareableLink: string;
  message: string;
}

export interface AttackResponse {
  id: string;
  attackerName: string;
  color: string;
  imageUrl?: string;
  message: string;
  createdAt: string;
  attackCount: number;
  referralAttackId?: string;
  victimName?: string;
  shareableLink: string;
}

export interface LeaderboardEntry {
  attackerName: string;
  totalAttacks: number;
  lastAttack: string;
  rank: number;
}

export interface DailyStatsResponse {
  totalAttacksToday: number;
  formattedMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttackService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  createAttack(request: CreateAttackRequest): Observable<CreateAttackResponse> {
    return this.http.post<CreateAttackResponse>(`${this.apiUrl}/attacks`, request);
  }

  getAttack(id: string): Observable<AttackResponse> {
    return this.http.get<AttackResponse>(`${this.apiUrl}/attacks/${id}`);
  }

  incrementAttackCounter(id: string): Observable<AttackResponse> {
    return this.http.put<AttackResponse>(`${this.apiUrl}/attacks/${id}/splash`, {});
  }

  getLeaderboard(limit: number = 10): Observable<LeaderboardEntry[]> {
    return this.http.get<LeaderboardEntry[]>(`${this.apiUrl}/attacks/leaderboard?limit=${limit}`);
  }

  getDailyStats(): Observable<DailyStatsResponse> {
    return this.http.get<DailyStatsResponse>(`${this.apiUrl}/attacks/stats/daily`);
  }

  getMyAttacks(attackerName: string): Observable<AttackResponse[]> {
    return this.http.get<AttackResponse[]>(`${this.apiUrl}/attacks/mine?attackerName=${attackerName}`);
  }

  // Health check
  checkHealth(): Observable<string> {
    return this.http.get(`${this.apiUrl}/attacks/health`, { responseType: 'text' });
  }
}