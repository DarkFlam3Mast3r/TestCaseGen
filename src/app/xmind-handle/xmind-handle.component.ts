import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';
import { XmindService } from '../services/xmind.service';

const flatData = [
  { id: 1, parent: null, title: 'Root' },
  { id: 2, parent: 1, title: 'Child 1' },
  { id: 3, parent: 1, title: 'Child 2' },
  { id: 4, parent: 2, title: 'Grandchild 1' },
  { id: 5, parent: 2, title: 'Grandchild 2' },
];
@Component({
  selector: 'app-xmind-handle',
  standalone: true,
  imports: [],
  templateUrl: './xmind-handle.component.html',
  styleUrl: './xmind-handle.component.css'
})
export class XmindHandleComponent implements OnInit {
  private diagram: go.Diagram;

  constructor(private xmindService: XmindService) {}

  ngOnInit() {
    this.diagram = new go.Diagram("myDiagramDiv");

    this.diagram.nodeTemplate =
      go.GraphObject.make(go.Node, "Auto",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        go.GraphObject.make(go.Shape, "RoundedRectangle",
          { strokeWidth: 0 },
          new go.Binding("fill", "color")
        ),
        go.GraphObject.make(go.TextBlock,
          { margin: 8 },
          new go.Binding("text", "text")
        )
      );

    const flatData = this.xmindService.getFlatData();
    const nodeDataArray = this.transformToNodeDataArray(flatData);
    const linkDataArray = this.transformToLinkDataArray(flatData);

    this.diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
  }

  transformToNodeDataArray(data: any[]): any[] {
    return data.map(item => {
      return {
        key: item.id,
        text: item.title,
        color: "lightblue",
        loc: item.loc
      };
    });
  }

  transformToLinkDataArray(data: any[]): any[] {
    return data.filter(item => item.parent !== null).map(item => {
      return { from: item.parent, to: item.id };
    });
  }
}