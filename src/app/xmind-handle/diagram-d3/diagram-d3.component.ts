import { Component, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-diagram-d3',
  standalone: true,
  imports: [],
  templateUrl: './diagram-d3.component.html',
  styleUrl: './diagram-d3.component.css'
})
export class DiagramD3Component {
  private data = {
    name: "Root",
    children: [
      { name: "Child 1" },
      {
        name: "Child 2",
        children: [
          { name: "Grandchild 1" },
          { name: "Grandchild 2" }
        ]
      }
    ]
  };
  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.createMindMap();
  }

  private createMindMap() {
    const element = this.el.nativeElement.querySelector('.mind-map');
    const width = 800;
    const height = 600;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(40,0)');

    const treeLayout = d3.tree().size([height, width - 160]);

    const root = d3.hierarchy(this.data);

    treeLayout(root);

    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkHorizontal()
        .x(d => d.y)
        .y(d => d.x)
      );

    svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.y},${d.x})`)
      .append('circle')
      .attr('r', 5);

    svg.selectAll('.node')
      .append('text')
      .attr('dy', '.35em')
      .attr('x', d => d.children ? -10 : 10)
      .style('text-anchor', d => d.children ? 'end' : 'start')
      .text(d => d.data.name);
  }
}
