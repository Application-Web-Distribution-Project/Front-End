import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AboutRoutingModule } from './about-routing.module';
import { AboutComponent } from './about.component';

import { SharedModule } from '../../shared/shared.module';
import { AbouttextComponent } from './abouttext/abouttext.component';
import { InfographicsComponent } from './infographics/infographics.component';
import { TeammemberComponent } from './teammember/teammember.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

@NgModule({
  declarations: [AboutComponent, AbouttextComponent, InfographicsComponent, TeammemberComponent, NewsletterComponent],
  imports: [
    CommonModule,
    SharedModule,
    AboutRoutingModule
  ]
})
export class AboutModule { }
