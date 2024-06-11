import { Route } from "@angular/router";
import { XmindHandleComponent } from "./xmind-handle.component";
import { DiagramViewerComponent } from "./diagram-viewer/diagram-viewer.component";
import { DiagramD3Component } from "./diagram-d3/diagram-d3.component";
import { XmindSdkComponent } from "./xmind-sdk/xmind-sdk.component";


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
        path:'sdk',
        component:XmindSdkComponent
    }

]