import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    standalone:true,
    selector:'[appPlaceholder]'
})
export class PlaceHolderDirective{
    constructor(public viewContainerRef: ViewContainerRef){

    }
}