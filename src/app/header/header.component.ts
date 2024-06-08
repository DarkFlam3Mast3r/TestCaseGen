import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Subscription } from "rxjs";
import { DropdownDirective } from "../shared/dropdown.directive";

@Component(
{
    standalone:true,
    imports:[CommonModule,RouterModule,
        DropdownDirective
    ],
    selector:'app-header',
    templateUrl:'./header.component.html',
    styleUrl:'./header.component.css'
}
)
export class HeaderComponent{
 // @Output() featureSelected = new EventEmitter<string>();
 isAuthenticated = false;
 collapsed = true;
//  private userSub: Subscription;
 constructor(){

 }
 ngOnInit(): void {
   
 }
 ngOnDestroy(): void {
 }
 // onSelect(feature:string,event:Event){
 //   this.featureSelected.emit(feature);
 //   console.log("show event:");
 //   console.log(event);

 // }
 onSaveData(){
 }

 onFetchData(){
 }
 onclickLogout(){
 }
}