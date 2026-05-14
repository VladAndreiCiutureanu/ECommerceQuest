import { Component, signal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { OrderService } from "../../services/order.service";

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './checkout.component.html',
    styleUrl: './checkout.component.css'
})

export class CheckoutComponent{
    errorMessage = signal('');
    successMessage = signal('');

    form = new FormGroup({
        shippingAddress: new FormControl('', [Validators.required])
    });

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private router: Router
    ){}

    onSubmit(): void{
        if(this.form.invalid) return;

        const request = {
            shippingAddress: this.form.value.shippingAddress!,
            items: this.cartService.getOrderItems()
        };

        this.orderService.checkout(request).subscribe({
            next: (response) => {
                this.cartService.clear();
                this.successMessage.set(`Order placed! Total: $${response.totalAmount.toFixed(2)}`);
                setTimeout(() => this.router.navigate(['/products']), 2000);
            },
            error: (err) => {
                console.error('Checkout error:', err);
                this.errorMessage.set(`Checkout failed: ${err.error || err.message}`);
            }
        });
    }
}
