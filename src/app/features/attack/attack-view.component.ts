import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttackService, AttackResponse } from '../../core/services/attack.service';

@Component({
  selector: 'app-attack-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attack-view.component.html',
  styleUrl: './attack-view.component.css'
})
export class AttackViewComponent implements OnInit {
  attackId: string = '';
  attackData: AttackResponse | null = null;
  attackImageUrl: string | null = null; // Store the actual image URL/data
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
    private router: Router,
    private attackService: AttackService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.attackId = params['id'];
      // Load the stored image data for this attack
      this.attackImageUrl = localStorage.getItem(`attack_image_${this.attackId}`);
      this.loadAttackData();
    });
  }

  private loadAttackData() {
    this.attackService.getAttack(this.attackId).subscribe({
      next: (response) => {
        this.attackData = response;
        this.isLoading = false;
        this.startCinematicSequence();
        
        // Increment the attack counter since someone viewed it
        this.attackService.incrementAttackCounter(this.attackId).subscribe({
          next: (updatedAttack) => {
            // Update the attack count in our local data
            if (this.attackData) {
              this.attackData.attackCount = updatedAttack.attackCount;
            }
          },
          error: (error) => {
            console.warn('Failed to increment attack counter:', error);
            // Continue anyway, this is not critical
          }
        });
      },
      error: (error) => {
        console.error('Failed to load attack:', error);
        this.isLoading = false;
        this.attackData = null;
      }
    });
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

  onImageLoadError(event: Event) {
    console.warn('Failed to load target image, using fallback');
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    // Show fallback placeholder
  }

  attackBack() {
    this.router.navigate(['/']);
  }

  goToLeaderboard() {
    this.router.navigate(['/leaderboard']);
  }

  shareAttack() {
    const shareUrl = this.attackData?.shareableLink || window.location.href;
    const shareText = `${this.attackData?.attackerName || 'Someone'} just attacked you with colors! 🎨`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Virtual Pichkari Attack!',
        text: shareText,
        url: shareUrl
      });
    } else {
      // Fallback: copy link to clipboard
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        // Fallback for older browsers
        prompt('Copy this link:', shareUrl);
      });
    }
  }
}