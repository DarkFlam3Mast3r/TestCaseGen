import { Injectable } from "@angular/core";

@Injectable({providedIn:'root'})
export class XmindService{
    constructor() {}

    getFlatData(): any[] {
      return [
        { id: 1, parent: null, title: 'Root' },
        { id: 2, parent: 1, title: 'Child 1' },
        { id: 3, parent: 1, title: 'Child 2' },
        { id: 4, parent: 2, title: 'Grandchild 1' },
        { id: 5, parent: 2, title: 'Grandchild 2' },
      ];
    }
}