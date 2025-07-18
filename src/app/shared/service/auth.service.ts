import { inject, Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authMsalService: MsalService = inject(MsalService);
  private _msalBroadcastService: MsalBroadcastService = inject(MsalBroadcastService);
}
