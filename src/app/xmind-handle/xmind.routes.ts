import { Route } from "@angular/router";
import { XmindHandleComponent } from "./xmind-handle.component";
import { DiagramViewerComponent } from "./diagram-viewer/diagram-viewer.component";
import { DiagramD3Component } from "./diagram-d3/diagram-d3.component";
import { MarkdownItTestComponent } from "./markdown-it-test/markdown-it-test.component";
import { D3TestComponent } from "./d3-test/d3-test.component";


export const XMIND_ROUTES: Route[] = [
    {
        path: '',
        component: XmindHandleComponent
    },
    {
        path: 'diagram',
        component: DiagramViewerComponent

    },
    {
        path:'d3',
        component:DiagramD3Component
    },
   
    {
        path:'markdown',
        component:MarkdownItTestComponent
    },
    {
        path:'d32',
        component:D3TestComponent
    },

]