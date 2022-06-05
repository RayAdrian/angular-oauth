import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  @ViewChild('googleLoginRef') googleLoginElement: ElementRef | undefined;
  userInfo: any = {};
  
  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.authService.fbInit();
  }

  ngAfterViewInit() {
    this.authService.googleInit(this.googleLoginElement);
  }

  async facebookClicked() {
    await this.authService.facebookLogin();
    this.userInfo = this.authService.getUser();
    this.cdr.detectChanges();
  }

}
