import { Component, OnDestroy, OnInit } from '@angular/core';
import { QustionService } from '../services/question.service';
import { Question } from '../models/question.model';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent implements OnInit,OnDestroy {
  question: Question;
  questions: Question[];
  quesitonIndex: number;

  questionSub:Subscription;

  disablePrevious: boolean = false;
  disableNext: boolean = false;

  constructor(private questionService: QustionService) {

  }
  ngOnInit(): void {
    this.questions = this.questionService.getQuestions();
    this.questionSub = this.questionService.currentQuestionIndex.subscribe(index => {
      this.quesitonIndex = index,
        this.question = this.questionService.getQuestion()
      console.log(this.question)
      this.checkPreviousNextAvailable()
    })
  }
  onClickPreviousQuestion() {
    this.questionService.previousQuestion(this.quesitonIndex)
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
    this.questionService.setAnswer(answer)
    this.onClickNextQuestion()
  }

  checkQuestionStatus(questionIndex: number, question: Question) {
    if (questionIndex === +this.quesitonIndex) {
      return 'current'
    }
    if (question.answer) {
      return 'answered'
    }

    return 'unanswered'
  }
  chooseQuestion(questionIndex: number) {
    this.questionService.setCurrerentQuestion(questionIndex);
    console.log(questionIndex)
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
    this.questionSub.unsubscribe()
  }

  test() {
    let questions = this.questionService.getQuestions();
    console.log(questions)
  }

}
