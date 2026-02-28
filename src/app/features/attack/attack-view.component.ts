import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-attack-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attack-view.component.html',
  styleUrl: './attack-view.component.css'
})
export class AttackViewComponent implements OnInit {
  attackId: string = '';
  attackData: any = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.attackId = params['id'];
      this.loadAttackData();
    });

    // Get data from router state if available
    const navigation = window.history.state;
    if (navigation?.attackData) {
      this.attackData = navigation.attackData;
      this.isLoading = false;
    }
  }

  private loadAttackData() {
    // Try to load from localStorage (fallback)
    const storedData = localStorage.getItem(`attack_${this.attackId}`);
    if (storedData) {
      this.attackData = JSON.parse(storedData);
    } else if (!this.attackData) {
      // No attack data found, redirect to home
      this.router.navigate(['/']);
      return;
    }
    this.isLoading = false;
  }

  attackBack() {
    this.router.navigate(['/']);
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  shareAttack() {
    if (navigator.share) {
      navigator.share({
        title: 'Virtual Pichkari Attack!',
        text: `${this.attackData?.attackerName || 'Someone'} just attacked you with colors! 🎨`,
        url: window.location.href
      });
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  }
}