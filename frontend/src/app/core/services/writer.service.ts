import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RecentWork {
  title: string;
  year: number;
  description: string;
}

export interface Writer {
  _id: string;
  name: string;
  bio?: string;
  photo?: string;
  bookCount: number;
  isFollowing: boolean;
  books?: any[];
  recentWorks?: RecentWork[];
  nationality?: string;
  genres?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class WriterService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/writers`;

  getFollowedWriters(): Observable<{ success: boolean; count: number; data: Writer[] }> {
    return this.http.get<{ success: boolean; count: number; data: Writer[] }>(`${this.apiUrl}/following`);
  }

  getAllWriters(): Observable<{ success: boolean; count: number; data: Writer[] }> {
    return this.http.get<{ success: boolean; count: number; data: Writer[] }>(this.apiUrl);
  }

  getWriter(writerId: string): Observable<{ success: boolean; data: Writer }> {
    return this.http.get<{ success: boolean; data: Writer }>(`${this.apiUrl}/${writerId}`);
  }

  followWriter(writerId: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/${writerId}/follow`, {});
  }

  unfollowWriter(writerId: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${writerId}/follow`);
  }

  searchWriters(query: string): Observable<{ success: boolean; count: number; data: Writer[] }> {
    return this.http.get<{ success: boolean; count: number; data: Writer[] }>(`${this.apiUrl}/search?q=${query}`);
  }
}

// Made with Bob