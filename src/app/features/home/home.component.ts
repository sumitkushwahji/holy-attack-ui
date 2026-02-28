import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AttackService, CreateAttackRequest } from '../../core/services/attack.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedFile: File | null = null;
  attackerName: string = '';
  selectedColor: string = '#FF69B4';
  isDragOver: boolean = false;
  cardTransform: string = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  isCardHovered: boolean = false;
  imagePreviewUrl: string | null = null;

  constructor(
    private router: Router,
    private attackService: AttackService
  ) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave() {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelect(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileSelect(input.files[0]);
    }
  }

  private handleFileSelect(file: File) {
    if (file.type.startsWith('image/')) {
      this.selectedFile = file;
      
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        this.imagePreviewUrl = imageDataUrl;
        // Store the image data in localStorage for demo purposes
        localStorage.setItem('uploadedImageData', imageDataUrl);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file!');
    }
  }

  launchAttack() {
    if (!this.selectedFile || !this.attackerName.trim()) {
      alert('Please upload a photo and enter your name!');
      return;
    }

    // For the API call, use a placeholder URL instead of the full base64 image
    // The actual image will be stored separately for display
    const placeholderUrl = 'https://holy-attack.app/uploads/' + this.selectedFile.name;
    
    const createRequest: CreateAttackRequest = {
      attackerName: this.attackerName.trim(),
      color: this.selectedColor,
      imageUrl: placeholderUrl,
      victimName: 'Friend' // Default victim name
    };

    this.attackService.createAttack(createRequest).subscribe({
      next: (response) => {
        console.log('Attack created:', response);
        
        // Store the actual image data for the attack view
        if (this.imagePreviewUrl) {
          localStorage.setItem(`attack_image_${response.attackId}`, this.imagePreviewUrl);
        }
        
        // Navigate to attack view using the backend ID
        this.router.navigate(['/attack', response.attackId]);
      },
      error: (error) => {
        console.error('Failed to create attack:', error);
        alert('Failed to create attack. Please try again!');
      }
    });
  }

  onCardMouseMove(event: MouseEvent) {
    if (!this.isCardHovered) {
      this.isCardHovered = true;
    }
    
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const width = rect.width;
    const height = rect.height;
    
    const rotateY = ((x - width / 2) / width) * 20; // Max 20 degrees
    const rotateX = ((y - height / 2) / height) * -20; // Max 20 degrees
    
    this.cardTransform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }

  onCardMouseLeave() {
    this.isCardHovered = false;
    this.cardTransform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }

  onColorSelect(color: string) {
    this.selectedColor = color;
  }

  onColorHover(color: string) {
    // Optional: Add hover effects
  }

  onColorLeave() {
    // Optional: Remove hover effects
  }
}