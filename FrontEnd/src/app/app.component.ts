import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'frontend';
  constructor(){}
  ngOnInit(): void {
    (function(d, m){
      const kommunicateSettings = {appId: '2b36ec21ab38d146c2e8609826155960c', popupWidget: true, automaticChatOpenOnNavigation: true};
      const s = document.createElement('script'); s.type = 'text/javascript'; s.async = true;
      s.src = 'https://widget.kommunicate.io/v2/kommunicate.app';
      const h = document.getElementsByTagName('head')[0]; h.appendChild(s);
      (window as any).kommunicate = m; m._globals = kommunicateSettings;})(document, (window as any).kommunicate || {});
  }
}
