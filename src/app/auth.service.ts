import { ElementRef, Injectable } from '@angular/core';
import { AUTH_CONFIG } from '../../config';

type UserInfo = {
  firstName?: string;
  lastName?: string;
  id?: string;
  token?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth2: any;
  windowVar: { [key: string]: any } = window;
  // userInfo: UserInfo | undefined;
  userInfo: any;
  constructor() { }

  googleInit(googleLoginElement: ElementRef | undefined) {
    setTimeout(() => {
      this.windowVar['gapi'].load('auth2', () => {
        this.auth2 = this.windowVar['gapi'].auth2.init({
          client_id: AUTH_CONFIG.google.appId,
          scope: AUTH_CONFIG.google.scope
        });
        this.googleSignIn(googleLoginElement);
      });
    }, 1000);
  }

  googleSignIn(googleLoginElement: ElementRef | undefined) {
    this.userInfo = {};
    this.auth2.attachClickHandler(googleLoginElement && googleLoginElement.nativeElement, {},
      (googleUser: any) => {
        // Get whatever info you need from here
        const profile = googleUser.getBasicProfile();
        const userAuthInfo = {
          id: profile.getId(),
          email: profile.getEmail(),
          firstName: profile.getGivenName(),
          lastName: profile.getFamilyName(),
          authToken: googleUser.getAuthResponse().access_token,
          idToken: googleUser.getAuthResponse().id_token,
        };

        console.log(userAuthInfo);

      }, (error: any) => {
        console.log(error)
      });
  }


  // Facebook
  fbInit() {
    (window as any).fbAsyncInit = function() {
      this.windowVar['FB'].init({
        appId      : AUTH_CONFIG.facebook.appId,
        cookie     : true,
        xfbml      : true,
        version    : 'v13.0'
      });
      this.windowVar['FB'].AppEvents.logPageView();
    };
 
    (function(d, s, id){
      let js: any, fjs: any = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = `https://connect.facebook.net/en_US/sdk/xfbml.save.js#xfbml=1&version=v13.0&appId=${AUTH_CONFIG.facebook.appId}`;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  facebookLogin() {
    this.userInfo = {};
    this.windowVar['FB'].login((response: any) => {
        if (response.authResponse) {
          this.windowVar['FB'].api('/me', {
            fields: 'last_name, first_name, email'
          }, (userInfo: any) => {
            console.log(userInfo);
          });
        } else {
          console.log('User login failed');
        }
    }, {scope: 'public_profile email'});
  }

  getUser() {
    return this.userInfo;
  }
}
