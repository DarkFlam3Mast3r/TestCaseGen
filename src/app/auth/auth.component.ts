import { Component, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthResponseData, AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { PlaceHolderDirective } from '../shared/placeholder/place-holder.directive';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [PlaceHolderDirective,LoadingSpinnerComponent,AlertComponent,FormsModule,CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})

export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  defaultName = "test2@test.com";
  defaultPassword = "12345678";
  @ViewChild(PlaceHolderDirective,{static:false}) alertHost:PlaceHolderDirective;
  private closeSub: Subscription;

  constructor(private authService: AuthService, private router: Router,
    // private componentFactorResolver:ComponentFactoryResolver
  ) {

  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm) {

    if (!form.valid) {
      return
    }
    const email = form.value.name;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signup(email, password)
    }
    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['./']);
      }, errorMessage => {
        this.error = errorMessage;
        this.showErrorAlert(this.error)
        this.isLoading = false;
      }
    )


    form.reset();
  }
  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    // const alertCmpFactory = this.componentFactorResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainRef = this.alertHost.viewContainerRef;
    hostViewContainRef.clear()

    const componentRef = hostViewContainRef.createComponent<AlertComponent>(AlertComponent)
    // const componentRef = hostViewContainRef.createComponent(alertCmpFactory)
    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe()
      hostViewContainRef.clear()
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe()
    }
  }
}
