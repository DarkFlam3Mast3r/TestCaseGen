import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '', redirectTo:'/questions',pathMatch:'full',
      },
      {
        path: 'questions',
        // component: AboutComponent,
        loadComponent:()=>import('./questions/questions.component').then(x=>x.QuestionsComponent)
      },
      {
        path: 'checklists',
        // component: AboutComponent,
        loadComponent:()=>import('./checklists/checklists.component').then(x=>x.ChecklistsComponent)
      },
      {
        path:'auth',
        loadComponent:()=>import('./auth/auth.component').then(x=>x.AuthComponent)
      }
];
