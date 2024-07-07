import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { QustionService } from '../../services/question.service';

@Component({
  selector: 'app-d3-mindmap',
  standalone: true,
  imports: [],
  templateUrl: './d3-mindmap.component.html',
  styleUrl: './d3-mindmap.component.css',
})
export class D3MindmapComponent implements OnInit, AfterViewInit {
  constructor(private questionService: QustionService) {}
  data = {};
  ngOnInit(): void {
    this.getData()
  }

  ngAfterViewInit(): void {
    this.createMindMap();
  }
  getData() {
    this.data = this.questionService.formatQuestionForD3();
  }

  createMindMap(): void {
    // const data = {
    //   name: 'Root',
    //   children: [
    //     {
    //       name: 'Branch 1',
    //       children: [{ name: 'Leaf 1.1' }, { name: 'Leaf 1.2' }],
    //     },
    //     {
    //       name: 'Branch 2',
    //       children: [{ name: 'Leaf 2.1' }, { name: 'Leaf 2.2' }],
    //     },
    //   ],
    // };
    const data = this.data

    const width = 600;
    const height = 400;
    const margin = { top: 10, right: 120, bottom: 10, left: 40 };

    const svg = d3
      .select('#mindmap')
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const root = d3.hierarchy(data);

    const treeLayout = d3.tree().size([height, width]);

    const links = treeLayout(root).links();
    const nodes = root.descendants();

    // Create links
    svg
      .selectAll('.link')
      .data(links)
      .enter()
      .append('line')
      .attr('class', 'link')
      .attr('x1', (d) => d.source.y)
      .attr('y1', (d) => d.source.x)
      .attr('x2', (d) => d.target.y)
      .attr('y2', (d) => d.target.x)
      .style('stroke', '#ccc')
      .style('stroke-width', '2px');

    // Create nodes
    const node = svg
      .selectAll('.node')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node.append('circle').attr('r', 10);

    node
      .append('text')
      .attr('dy', (d) => (d.children ? -15 : 5)) // Position non-leaf labels above and leaf labels to the right
      .attr('x', (d) => (d.children ? 0 : 12)) // Offset leaf labels to the right
      .style('text-anchor', (d) => (d.children ? 'middle' : 'start'))
      .text((d) => d.data.name);
    // node.each(function (d) {
    //   if (d.children) {
    //     const customX = d.depth * 180; // Custom X position based on depth
    //     const customY = d.height * 100; // Custom Y position based on height
    //     d3.select(this).attr('transform', `translate(${customX},${customY})`);
    //   }
    // });

    // Handle node click event to mark status
    node.on('click', function (event, d) {
      d3.select(this)
        .select('circle')
        .attr('fill', function () {
          return d3.select(this).attr('fill') === 'green' ? 'red' : 'green';
        });
    });

    const zoom = d3.zoom().on('zoom', (event) => {
      svg.attr('transform', event.transform);
    });

    d3.select('svg').call(zoom);
  }
}
