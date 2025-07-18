import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MsalBroadcastService, MsalGuardConfiguration, MsalService } from '@azure/msal-angular';
import { filter, Subject, takeUntil } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [RouterLink, RouterOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {
  title = 'Angular - MSAL Example';
  loginDisplay = false;
  tokenExpiration: string = '';
  private readonly _destroying$ = new Subject<void>();

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private authService: MsalService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private msalBroadcastService: MsalBroadcastService
  ) {}

  // On initialization of the page, display the page elements based on the user state
  ngOnInit(): void {
    this.authService.handleRedirectObservable().subscribe();
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this._destroying$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    // Used for storing and displaying token expiration
    this.msalBroadcastService.msalSubject$
      .pipe(filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS))
      .subscribe((msg) => {
        this.tokenExpiration = (msg.payload as any).expiresOn;
        localStorage.setItem('tokenExpiration', this.tokenExpiration);
      });
  }

  // If the user is logged in, present the user with a "logged in" experience
  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
    console.log(this.authService.instance.getAllAccounts()?.[0].idToken);
  }

  // Log the user in and redirect them if MSAL provides a redirect URI otherwise go to the default URI
  login() {
    if (this.msalGuardConfig.authRequest) {
      this.authService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest).subscribe();
    } else {
      this.authService.loginRedirect().subscribe();
    }
  }

  // Log the user out
  logout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
