import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { SellProductComponent } from './products/sell-product/sell-product.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserProductsComponent } from './user/user-products/user-products.component';
import { HomeComponent } from './home/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { ProductsByCategoryComponent } from './categorie/categoria/categoria.component';
import { SearchResultsComponent } from './search/search-results/search-results.component';
import { ChatComponent } from './chat/chat.component';
import { MisChatsComponent } from './mis-chats/mis-chats.component';
import { LegalDocumentsComponent } from './legal-documents/legal-documents.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'legal-documents', component: LegalDocumentsComponent },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard] },
  { path: 'categories/:categoria', component: ProductsByCategoryComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'sell', component: SellProductComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: UserProfileComponent },
  { path: 'my-products', component: UserProductsComponent },
  { path: 'search', component: SearchResultsComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'mis-chats', component: MisChatsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
