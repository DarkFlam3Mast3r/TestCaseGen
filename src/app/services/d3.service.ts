import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class D3Service {
  constructor() { }

  createMindMap(data: any, element: HTMLElement, direction: string = 'vertical') {
    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };
    const svgWidth = width - margin.left - margin.right;
    const svgHeight = height - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const root = d3.hierarchy(data);
    let treeLayout;
    
    if (direction === 'horizontal') {
      treeLayout = d3.tree().size([svgHeight, svgWidth]);
    } else {
      treeLayout = d3.tree().size([svgWidth, svgHeight]);
    }
    
    treeLayout(root);

    // Links
    svg.selectAll('line')
      .data(root.links())
      .enter()
      .append('line')
      .attr('x1', d => direction === 'horizontal' ? d.source.y : d.source.x)
      .attr('y1', d => direction === 'horizontal' ? d.source.x : d.source.y)
      .attr('x2', d => direction === 'horizontal' ? d.target.y : d.target.x)
      .attr('y2', d => direction === 'horizontal' ? d.target.x : d.target.y)
      .attr('stroke', '#ccc');

    // Nodes
    svg.selectAll('circle')
      .data(root.descendants())
      .enter()
      .append('circle')
      .attr('cx', d => direction === 'horizontal' ? d.y : d.x)
      .attr('cy', d => direction === 'horizontal' ? d.x : d.y)
      .attr('r', 5)
      .attr('fill', '#999');

    // Text
    svg.selectAll('text')
      .data(root.descendants())
      .enter()
      .append('text')
      .attr('x', d => direction === 'horizontal' ? d.y : d.x)
      .attr('y', d => direction === 'horizontal' ? d.x - 10 : d.y - 10)
      .text(d => d.data.name)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('fill', '#333');
  }
}
