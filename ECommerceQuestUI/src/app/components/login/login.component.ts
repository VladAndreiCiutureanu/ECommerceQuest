import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent{
  errorMessage = signal('');

  form = new FormGroup({
    emailOrUsername: new FormControl('',[Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private authService: AuthService, private router: Router){}

  onSubmit(): void{
    if(this.form.invalid) return;

    this.authService.login({
      emailOrUsername: this.form.value.emailOrUsername!,
      password: this.form.value.password!
    }).subscribe({
      next: () => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        const msg = typeof err.error === 'string' 
            ? err.error 
            : (err.error?.message || err.error?.title || 'Invalid credentials.');
        this.errorMessage.set(msg);
        console.error('Login error:', err);
      }
    })
  }
}
