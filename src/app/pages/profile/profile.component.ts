import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { filter, from } from 'rxjs';
import { EventMessage, EventType } from '@azure/msal-browser';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
  private authService = inject(MsalService);
  private msalBroadcastService: MsalBroadcastService = inject(MsalBroadcastService);
  private broadcastService: MsalBroadcastService = inject(MsalBroadcastService);
  private readonly _destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS),
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((result: EventMessage) => {
        console.log(result, 'result');
      });

    const tokenRequest = {
      scopes: ['user.read'] // тут вказуйте потрібні вам scope
    };
    from(this.authService.instance.acquireTokenSilent(tokenRequest)).subscribe((res) => {
      console.log('aasfsdgwrSDGBSGWE', res);
    });

    /*  this.msalBroadcastService.inProgress$
        .pipe(filter((status: InteractionStatus) => status === InteractionStatus.None))
        .subscribe(() => {
          const account = this.authService.instance.getActiveAccount();
          console.log(account);
        });*/
  }

  async getAuthToken(): Promise<string> {
    try {
      const account = this.authService.instance.getActiveAccount();
      console.log(account);
      if (!account) {
        throw new Error('Користувач не авторизований');
      }

      const tokenRequest = {
        scopes: ['user.read'], // тут вказуйте потрібні вам scope
        account: account
      };

      const tokenResponse = await this.authService.instance.acquireTokenSilent(tokenRequest);
      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Помилка отримання токену:', error);
      throw error;
    }
  }
}
