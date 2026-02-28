import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

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
    } else {
      alert('Please select an image file!');
    }
  }

  launchAttack() {
    if (!this.selectedFile || !this.attackerName.trim()) {
      alert('Please upload a photo and enter your name!');
      return;
    }

    // Create a unique attack ID
    const attackId = Date.now().toString();
    
    // Store attack data (in real app, this would be sent to backend)
    const attackData = {
      id: attackId,
      attackerName: this.attackerName,
      targetImage: this.selectedFile,
      splashColor: this.selectedColor,
      timestamp: new Date()
    };

    // Store in localStorage for demo purposes
    localStorage.setItem(`attack_${attackId}`, JSON.stringify({
      ...attackData,
      targetImage: null // Can't store File in localStorage
    }));

    // Navigate to attack view
    this.router.navigate(['/attack', attackId], { 
      state: { attackData } 
    });
  }
}