import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { GameAreaComponent } from './view/game-area/game-area.component';

@NgModule({
  declarations: [
    AppComponent,
    GameAreaComponent
  ],
  imports: [
    BrowserModule,
    ToastModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
