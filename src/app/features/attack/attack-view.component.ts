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
  
  // Cinematic animation states
  showOverlay: boolean = true;
  showCountdown: boolean = false;
  countdownNumber: number = 3;
  splashActive: boolean = false;
  showMessage: boolean = false;
  showButtons: boolean = false;

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
    this.startCinematicSequence();
  }

  private startCinematicSequence() {
    // Start cinematic sequence after small delay
    setTimeout(() => {
      this.startCountdown();
    }, 500);
  }

  private startCountdown() {
    this.showCountdown = true;
    
    const countdownInterval = setInterval(() => {
      this.countdownNumber--;
      
      if (this.countdownNumber <= 0) {
        clearInterval(countdownInterval);
        this.showCountdown = false;
        this.triggerSplash();
      }
    }, 800);
  }

  private triggerSplash() {
    // Hide overlay to reveal splash
    this.showOverlay = false;
    
    // Activate splash effects
    setTimeout(() => {
      this.splashActive = true;
    }, 500);
    
    // Show message with scale-in animation
    setTimeout(() => {
      this.showMessage = true;
    }, 1200);
    
    // Show action buttons
    setTimeout(() => {
      this.showButtons = true;
    }, 1800);
  }

  getColorName(hexColor: string): string {
    const colorMap: { [key: string]: string } = {
      '#FF69B4': 'Pink',
      '#FFD700': 'Golden Yellow',
      '#87CEEB': 'Sky Blue',
      '#FFA500': 'Orange',
      '#32CD32': 'Lime Green',
      '#9370DB': 'Purple'
    };
    return colorMap[hexColor] || 'Colorful';
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