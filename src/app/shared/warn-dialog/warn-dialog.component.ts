import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogModule } from "@angular/material/dialog";
@Component({
  selector: 'app-warn-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './warn-dialog.component.html',
  styleUrl: './warn-dialog.component.css'
})
export class WarnDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:{message:string}){}
}
