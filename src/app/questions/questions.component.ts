import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { QustionService } from '../services/question.service';
import { Question } from '../models/question.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { WarnDialogComponent } from '../shared/warn-dialog/warn-dialog.component';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionsComponent implements OnInit, OnDestroy {
  question: Question;
  questions: Question[];
  quesitonIndex: number;

  questionSub: Subscription;

  disablePrevious: boolean = false;
  disableNext: boolean = false;
  constructor(
    private questionService: QustionService,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.questions = this.questionService.getQuestions();
    this.questionSub = this.questionService.currentQuestionIndex.subscribe(
      (index) => {
        (this.quesitonIndex = index),
          (this.question = this.questionService.getQuestion());
        console.log(this.question);
        this.checkPreviousNextAvailable();
      }
    );
  }
  onClickPreviousQuestion() {
    this.questionService.previousQuestion(this.quesitonIndex);
  }
  onClickNextQuestion() {
    this.questionService.nextQuestion(this.quesitonIndex);
  }
  checkPreviousNextAvailable() {
    this.disableNext = false;
    this.disablePrevious = false;
    if (+this.quesitonIndex <= 0) {
      this.disablePrevious = true;
    }
    if (+this.quesitonIndex >= this.questions.length - 1) {
      this.disableNext = true;
    }
  }
  onClickAnswer(answer: string) {
    this.questionService.setAnswer(answer);
    this.onClickNextQuestion();
  }

  checkQuestionStatus(questionIndex: number, question: Question) {
    if (questionIndex === +this.quesitonIndex) {
      return 'current';
    }
    if (question.answer) {
      return 'answered';
    }

    return 'unanswered';
  }
  chooseQuestion(questionIndex: number) {
    this.questionService.setCurrerentQuestion(questionIndex);
    console.log(questionIndex);
    this.disableNext = false;
    this.disablePrevious = false;
    if (+questionIndex === 0) {
      this.disablePrevious = true;
    }
    if (+questionIndex === this.questions.length - 1) {
      this.disableNext = true;
    }
  }

  ngOnDestroy(): void {
    this.questionSub.unsubscribe();
  }

  test() {
    let questions = this.questionService.getQuestions();
    console.log(questions);
    let finished = true
    questions.forEach((question) => {
      if (question.answer == undefined || question.answer == null) {
        finished = false
        console.log('还有问题没回答');
       
      }
    });
    if(!finished){
      const dialogRef =  this.dialog.open(
        AlertComponent,
        {data:{message:'没有回答完，确定继续吗'}}
      );
      dialogRef.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        if(result){
          this.openSummaryDialog();
        }
      });

      return
    }
    

    this.openSummaryDialog();
  }
  openSummaryDialog() {
    let questions = this.questionService.getQuestions();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = questions;
    const dialogRef = this.dialog.open(
      DialogContentExampleDialog,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
  onSubmit() {
    let alterMessage = 'sadjaisdjiaw';
  }
}

@Component({
  templateUrl: './example.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Question[]) {}
}

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<h1 mat-dialog-title>注意</h1>
    <div mat-dialog-content>
      <p class="mat-body-1">{{ data.message }}</p>
    </div>
    <div mat-dialog-actions>
      <span style="flex:1 1 auto;"></span>
      <button mat-button mat-dialog-close>取消</button>
      <button mat-button [mat-dialog-close]="true">继续</button>
    </div>`
})
export class AlertComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
