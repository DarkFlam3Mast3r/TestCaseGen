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
      },
      {
        path:'map',
        loadComponent:()=>import('./game-map/game-map.component').then(x=>x.GameMapComponent)
      },
      {
        path:'gpt',
        loadComponent:()=>import('./gpt/gpt.component').then(x=>x.GPTComponent)
      },
      {
        path:'xmind',
        loadChildren:()=>import('./xmind-handle/xmind.routes').then(x=>x.XMIND_ROUTES)
      },
      {
        path:'mindmap',
        loadComponent:()=>import('./mindmap/d3-mindmap/d3-mindmap.component').then(x=>x.D3MindmapComponent)
      },
      {
        path: '**',
        redirectTo: '/questions',
      },
];
