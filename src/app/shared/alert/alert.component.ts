import { Component, EventEmitter, Input, Output, output } from "@angular/core";

@Component({
    standalone:true,
    selector:'app-alert',
    templateUrl:'./alert.component.html',
    styleUrl:'./alert.component.css'
})
export class AlertComponent{
 @Input() message:string;
 @Output() close=new EventEmitter<void>();

 onClose(){
    this.close.emit();
 }

}