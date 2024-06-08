import { Directive, ElementRef, Renderer2,HostBinding, HostListener } from "@angular/core";

@Directive({
    standalone:true,
    selector: '[appDropDown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;
    // @HostBinding('style.backgroundColor') backgroundColor: string;
    @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
        this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
      }
    constructor(private elRef:ElementRef,private renderer:Renderer2){

    }

}