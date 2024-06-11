import { Component, OnInit, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { D3Service } from '../../services/d3.service';

@Component({
  selector: 'app-d3-test',
  standalone: true,
  imports: [],
  templateUrl: './d3-test.component.html',
  styleUrl: './d3-test.component.css'
})

export class D3TestComponent implements OnInit{
  private data = {
    name: 'Root',
    children: [
      {
        name: 'Child 1',
        children: [
          { name: 'Grandchild 1.1' },
          { name: 'Grandchild 1.2' }
        ]
      },
      {
        name: 'Child 2',
        children: [
          { name: 'Grandchild 2.1' },
          { name: 'Grandchild 2.2' }
        ]
      }
    ]
  };

  private direction = 'horizontal';  // 或 'vertical'

  constructor(private d3Service: D3Service, private el: ElementRef) { }

  ngOnInit(): void {
    this.d3Service.createMindMap(this.data, this.el.nativeElement.querySelector('.mindmap-container'), this.direction);
  }
}