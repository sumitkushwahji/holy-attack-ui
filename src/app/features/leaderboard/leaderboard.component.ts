import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AttackService, LeaderboardEntry, DailyStatsResponse } from '../../core/services/attack.service';

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
  dailyMessage: string = '';
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private attackService: AttackService
  ) {}

  ngOnInit() {
    this.loadLeaderboard();
    this.loadDailyStats();
  }

  private loadLeaderboard() {
    this.attackService.getLeaderboard(10).subscribe({
      next: (data: LeaderboardEntry[]) => {
        this.leaderboard = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load leaderboard:', error);
        this.loadFallbackData();
        this.isLoading = false;
      }
    });
  }

  private loadDailyStats() {
    this.attackService.getDailyStats().subscribe({
      next: (stats: DailyStatsResponse) => {
        this.dailyCount = stats.totalAttacksToday;
        this.dailyMessage = stats.formattedMessage;
      },
      error: (error) => {
        console.error('Failed to load daily stats:', error);
        this.dailyCount = 0;
        this.dailyMessage = 'No attacks today yet! 🎨';
      }
    });
  }

  private loadFallbackData() {
    // Fallback data in case backend is not available
    this.leaderboard = [
      {
        rank: 1,
        attackerName: 'ColorMaster2024',
        totalAttacks: 156,
        lastAttack: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        rank: 2,
        attackerName: 'HoliWarrior',
        totalAttacks: 143,
        lastAttack: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        rank: 3,
        attackerName: 'SplashKing',
        totalAttacks: 128,
        lastAttack: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        rank: 4,
        attackerName: 'RainbowRider',
        totalAttacks: 94,
        lastAttack: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        rank: 5,
        attackerName: 'PichkariPro',
        totalAttacks: 87,
        lastAttack: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      }
    ];
    this.dailyCount = 2847;
  }

  goHome() {
    this.router.navigate(['/']);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
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