import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterUserComponent {
  errorMessage = signal('');

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fullName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private authService: AuthService, private router: Router){}

  onSubmit(): void{
    if(this.form.invalid) return;

    this.authService.register({
      email: this.form.value.email!,
      username: this.form.value.username!,
      fullName: this.form.value.fullName!,
      password: this.form.value.password!
    }).subscribe({
      next: () =>{
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Full register error:', err);
        let msg = 'Registration Error';
        if (typeof err.error === 'string') {
            msg = err.error;
        } else if (err.error && err.error.errors) {
            msg = Object.values(err.error.errors).flat().join(' ');
        } else if (err.error?.message || err.error?.title) {
            msg = err.error.message || err.error.title;
        } else if (err.error) {
            msg = JSON.stringify(err.error);
        } else {
            msg = err.message;
        }
        this.errorMessage.set(msg);
      }
    })
  }
}
