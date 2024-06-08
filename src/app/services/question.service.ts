import { Injectable, OnDestroy, OnInit, numberAttribute } from "@angular/core";
import { Question } from "../models/question.model";
import { BehaviorSubject, take } from "rxjs";

@Injectable({ providedIn: 'root' })
export class QustionService implements OnInit {
    currentQuestionIndex = new BehaviorSubject<number>(0);
    currentQuestion:Question;


    private questions: Question[] = [
        new Question(1, 'question 1 demo', ['是','否']),
        new Question(2, 'question 2 demo with answewr', ['是','否'],'是'),
        new Question(3, 'question 3 demo with answewr', ['是','否','或'],'否'),
        new Question(4, 'question 4 demo', ['是','否']),
        new Question(5, 'question 5 demo with answewr', ['是','否'],'是'),
        new Question(6, 'question 6 demo with answewr', ['是','否','或'],'否'), 
        new Question(7, 'question 7 demo', ['是','否']),
        new Question(8, 'question 8 demo with answewr', ['是','否'],'是'),
        new Question(9, 'question 9 demo with answewr', ['是','否','或'],'否')
    ];
    constructor() {
        this.currentQuestion = this.questions[0];
        this.currentQuestionIndex.subscribe(index=>{
            this.currentQuestion = this.questions[index]
        })
    }
    ngOnInit(): void {
        this.currentQuestionIndex = new BehaviorSubject<number>(0);
       
    }
    nextQuestion(currentQuestion: number) {
        if (currentQuestion < this.questions.length-1) {
            this.currentQuestionIndex.next(+currentQuestion + 1);
            return 1
        }else{
            return -1
        }
        
    }
    previousQuestion(currentQuestion: number) {
        if (currentQuestion > 0) {
            this.currentQuestionIndex.next(+currentQuestion - 1);
            return 1
        }else{
            return -1
        }
    }

    getQuestion(){
        return this.currentQuestion;
    }
    getQuestions(){
        return this.questions.slice();
    }
    
    setAnswer(answer:string){
        this.currentQuestion.answer=answer;
    }
    setCurrerentQuestion(questionIndex:number){
        this.currentQuestionIndex.next(questionIndex);
    }


}