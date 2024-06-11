import { Component } from '@angular/core';
import { DiagramModule } from '@syncfusion/ej2-angular-diagrams';

@Component({
  selector: 'app-diagram-viewer',
  standalone: true,
  imports: [DiagramModule],
  templateUrl: './diagram-viewer.component.html',
  styleUrl: './diagram-viewer.component.css'
})
export class DiagramViewerComponent {

}
