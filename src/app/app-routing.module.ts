import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';


import { ItemsListComponent } from './items/items-list/items-list.component';
import { ReadmePageComponent } from './ui/readme-page/readme-page.component';
import { NotesListComponent } from './notes/notes-list/notes-list.component';

import { UserFormComponent } from './ui/user-form/user-form.component';

const routes: Routes = [
  { path: '', component: ReadmePageComponent },
  { path: 'login', component: UserFormComponent, },
  { path: 'items', component: ItemsListComponent, canActivate: [AuthGuard]},
  { path: 'notes', component: NotesListComponent,  canActivate: [AuthGuard] },
  // uploads are lazy loaded
  { path: 'uploads', loadChildren: './uploads/shared/upload.module#UploadModule', canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
