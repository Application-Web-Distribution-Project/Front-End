import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReclamationStatsComponent } from './components/pages/Reclamation/reclamation-stats/reclamation-stats.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule), data: { breadcrumb: 'Homepage' } },
  { path: 'home-v2', loadChildren: () => import('./components/pages/hometwo/hometwo.module').then(m => m.HometwoModule), data: { breadcrumb: 'Homepage' } },
  { path: 'home-v3', loadChildren: () => import('./components/pages/homethree/homethree.module').then(m => m.HomethreeModule), data: { breadcrumb: 'Homepage' } },
  { path: 'home-v4', loadChildren: () => import('./components/pages/homefour/homefour.module').then(m => m.HomefourModule), data: { breadcrumb: 'Homepage' } },
  { path: 'blog-grid', loadChildren: () => import('./components/pages/bloggrid/bloggrid.module').then(m => m.BloggridModule), data: { breadcrumb: 'Blog Grid' } },
  { path: 'blog-list', loadChildren: () => import('./components/pages/bloglist/bloglist.module').then(m => m.BloglistModule), data: { breadcrumb: 'Blog List' } },
  { path: 'blog-masonry', loadChildren: () => import('./components/pages/blogmasonry/blogmasonry.module').then(m => m.BlogmasonryModule), data: { breadcrumb: 'Blog Masonry' } },
  { path: 'blog-full-width', loadChildren: () => import('./components/pages/blogfull/blogfull.module').then(m => m.BlogfullModule), data: { breadcrumb: 'Blog Full Width' } },
  { path: 'blog-single/:id', loadChildren: () => import('./components/pages/blogsingle/blogsingle.module').then(m => m.BlogsingleModule), data: { breadcrumb: 'Blog Details' } },
  { path: 'about', loadChildren: () => import('./components/pages/about/about.module').then(m => m.AboutModule), data: { breadcrumb: 'About Us' } },
  { path: 'login', loadChildren: () => import('./components/pages/login/login.module').then(m => m.LoginModule), data: { breadcrumb: 'Login' } },
  { path: 'register', loadChildren: () => import('./components/pages/register/register.module').then(m => m.RegisterModule), data: { breadcrumb: 'Register' } },
  { path: 'checkout', loadChildren: () => import('./components/pages/checkout/checkout.module').then(m => m.CheckoutModule), data: { breadcrumb: 'Checkout' } },
  { path: 'cart', loadChildren: () => import('./components/pages/cart/cart.module').then(m => m.CartModule), data: { breadcrumb: 'Cart' } },
  { path: 'legal', loadChildren: () => import('./components/pages/legal/legal.module').then(m => m.LegalModule), data: { breadcrumb: 'Legal' } },
  { path: 'menu-v1', loadChildren: () => import('./components/pages/menuone/menuone.module').then(m => m.MenuoneModule), data: { breadcrumb: 'Menu v1' } },
  { path: 'menu-v2', loadChildren: () => import('./components/pages/menutwo/menutwo.module').then(m => m.MenutwoModule), data: { breadcrumb: 'Menu v2' } },
  { path: 'menu-item-v1/:id', loadChildren: () => import('./components/pages/menuitemone/menuitemone.module').then(m => m.MenuitemoneModule), data: { breadcrumb: 'Menu Item v1' } },
  { path: 'menu-item-v2/:id', loadChildren: () => import('./components/pages/menuitemtwo/menuitemtwo.module').then(m => m.MenuitemtwoModule), data: { breadcrumb: 'Menu Item v2' } },
  { path: 'locations', loadChildren: () => import('./components/pages/locations/locations.module').then(m => m.LocationsModule), data: { breadcrumb: 'Locations' } },
  { path: 'contact', loadChildren: () => import('./components/pages/contact/contact.module').then(m => m.ContactModule), data: { breadcrumb: 'Contact Us' } },
  { 
    path: 'reclamations', 
    loadChildren: () => import('./components/pages/Reclamation/reclamation.module').then(m => m.ReclamationModule), 
    data: { breadcrumb: 'Réclamations' } 
  },
  { path: '', redirectTo: '/reclamations', pathMatch: 'full' },
  { path: 'error', loadChildren: () => import('./components/pages/error/error.module').then(m => m.ErrorModule), data: { breadcrumb: 'Error 404' } },
  { path: '**', loadChildren: () => import('./components/pages/error/error.module').then(m => m.ErrorModule), data: { breadcrumb: 'Error 404' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
