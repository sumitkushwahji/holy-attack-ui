import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface LeaderboardEntry {
  rank: number;
  name: string;
  attacks: number;
  totalColors: number;
  lastAttack: Date;
}

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './leaderboard.component.html',
  styleUrl: './leaderboard.component.css'
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  dailyCount: number = 0;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadLeaderboard();
    this.loadDailyCount();
  }

  private loadLeaderboard() {
    // Mock data for demonstration
    this.leaderboard = [
      {
        rank: 1,
        name: 'ColorMaster2024',
        attacks: 156,
        totalColors: 432,
        lastAttack: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
      },
      {
        rank: 2,
        name: 'HoliWarrior',
        attacks: 143,
        totalColors: 387,
        lastAttack: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
      },
      {
        rank: 3,
        name: 'SplashKing',
        attacks: 128,
        totalColors: 356,
        lastAttack: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
      },
      {
        rank: 4,
        name: 'RainbowRider',
        attacks: 94,
        totalColors: 267,
        lastAttack: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        rank: 5,
        name: 'PichkariPro',
        attacks: 87,
        totalColors: 241,
        lastAttack: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ];
  }

  private loadDailyCount() {
    // Mock daily counter
    this.dailyCount = 2847;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  }

  getRankDisplay(rank: number): string {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  }

  trackByRank(index: number, item: LeaderboardEntry): number {
    return item.rank;
  }

  onRowHover(event: Event, isEntering: boolean, rank?: number): void {
    const target = event.target as HTMLElement;
    if (target) {
      if (isEntering) {
        target.style.background = 'linear-gradient(135deg, rgba(147, 112, 219, 0.05), rgba(255, 105, 180, 0.05))';
      } else {
        const isTopRank = rank && rank <= 3;
        target.style.background = isTopRank 
          ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(255, 165, 0, 0.05))' 
          : 'transparent';
      }
    }
  }
}