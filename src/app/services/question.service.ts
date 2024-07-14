import { Injectable, OnInit } from '@angular/core';
import { Question, QuestionData } from '../models/question.model';
import { BehaviorSubject, Subject } from 'rxjs';

const jsonData: QuestionData = {
  id: 1,
  QuestionText: '是否包含排行榜？',
  ChoiceText: '是；否',
  question_type: 3,
  include: '排序是否正确+balbala+排行榜刷新时间是否太频繁或者太慢（参考数据）',
  related_bug: '',
  notice: '',
  content: '',
  active: true,
  children: [
    {
      id: 2,
      QuestionText: '排行榜的类别是？',
      ChoiceText: '通用；赛季；自定义',
      question_type: 2,
      include: '通用：xxx；赛季：yyy；自定义：zzz；',
      related_bug: '',
      notice: '',
      content: '',
      active: true,
      children: [],
    },
    {
      id: 3,
      QuestionText: '是否发奖？',
      ChoiceText: '是；否',
      question_type: 3,
      include: '发奖：超过预期名次的玩家不能获得奖励',
      related_bug: '',
      notice: '',
      content: '',
      active: true,
      children: [
        {
          id: 4,
          QuestionText: '发奖是否有同分对齐？',
          ChoiceText: '是；否',
          question_type: 1,
          include: '同分对齐：检查超过预期名次，但是同分玩家是否能获得奖励',
          related_bug: '',
          notice: '',
          content: '',
          active: true,
          children: [],
        },
      ],
    },
    {
      id: 5,
      QuestionText: '是否会碰到合服？',
      ChoiceText: '是；否',
      question_type: 1,
      include: '合服：确保合服后数据符合预期',
      related_bug: '',
      notice: '',
      content: '',
      active: true,
      children: [],
    },
    {
      id: 6,
      QuestionText: '排行榜是否涉及帮会？',
      ChoiceText: '是；否',
      question_type: 1,
      include: '合帮后数据符合预期+帮会解散后数据符合预期',
      related_bug: '',
      notice: '',
      content: '',
      active: true,
      children: [],
    },
    {
      id: 7,
      QuestionText: '排行榜是否涉及跨服？',
      ChoiceText: '是；否',
      question_type: 1,
      include: '跨服上查询，上报数据表现正常',
      related_bug: '',
      notice: '',
      content: '',
      active: true,
      children: [],
    },
  ],
};

@Injectable({ providedIn: 'root' })
export class QustionService implements OnInit {
  currentQuestionIndex = new BehaviorSubject<number>(0);
  currentQuestion: Question;
  questions: Question[];
  rootQuestion: Question;


  QuestionChange = new Subject<Question[]>();

  constructor() {
    const localData = localStorage.getItem('questionsData');
    if (localData) {
      let jsonData = this.loadQuestionsFromLocalStorage();
      this.questions = jsonData;
      this.rootQuestion=this.questions[0]
      console.log(jsonData);
    } else {
      this.setQuestions();
    }
    this.currentQuestion = this.questions[0];
    this.currentQuestionIndex.subscribe((index) => {
      this.currentQuestion = this.questions[index];
    });
  }

  ngOnInit(): void {
    this.currentQuestionIndex = new BehaviorSubject<number>(0);
  }

  setQuestions() {
    // Convert JSON data to root Question instance
    const rootQuestion = Question.fromJSON(jsonData);
    this.rootQuestion = rootQuestion;
    rootQuestion.active = true;
    // Collect all Question instances into a single array
    const questions = Question.collectAllQuestions(rootQuestion);
    rootQuestion.setChildrenActive(false); // Set all children to inactive
    this.questions = Question.collectAllQuestions(rootQuestion);
    console.log(questions);
  }

  nextQuestion(currentQuestion: number) {
    if (currentQuestion < this.questions.length - 1) {
      this.currentQuestionIndex.next(+currentQuestion + 1);
      if (this.currentQuestion.active === false) {
        this.nextQuestion(+currentQuestion + 1);
      }
      return 1;
    } else {
      return -1;
    }
  }
  previousQuestion(currentQuestion: number) {
    if (currentQuestion > 0) {
      this.currentQuestionIndex.next(+currentQuestion - 1);
      if (this.currentQuestion.active === false) {
        this.previousQuestion(+currentQuestion - 1);
      }
      return 1;
    } else {
      return -1;
    }
  }

  getQuestion() {
    return this.currentQuestion;
  }
  getQuestions() {
    return this.questions.slice();
  }

  setAnswer(answer: string) {
    this.currentQuestion.answer = answer;
    if (
      this.currentQuestion.question_type == 3 &&
      this.currentQuestion.answer == '否'
    ) {
      this.currentQuestion.setChildrenActive(false);
      this.questions = Question.collectAllQuestions(this.rootQuestion);
      this.QuestionChange.next(this.questions)

    }
    if (
      this.currentQuestion.question_type == 3 &&
      this.currentQuestion.answer == '是'
    ) {
      this.currentQuestion.setDirectChildrenActive(true);
      this.questions = Question.collectAllQuestions(this.rootQuestion);
      this.QuestionChange.next(this.questions)
    }
    if(this.currentQuestion.question_type == 2){

    }

    this.storeQuestionsLocal();
  }
  setCurrerentQuestion(questionIndex: number) {
    this.currentQuestionIndex.next(questionIndex);
  }

  formatQuestionForD3() {
    const newFormatData = Question.transformToNewFormat(this.rootQuestion);
    console.log(JSON.stringify(newFormatData, null, 2));
    return newFormatData;
  }

  storeQuestionsLocal() {
    const jsonString = JSON.stringify(this.questions.map((q) => q.toJSON()));
    localStorage.setItem('questionsData', jsonString);
  }

  // Function to load questions from local storage
  loadQuestionsFromLocalStorage(): Question[] {
    const localData = localStorage.getItem('questionsData');

    if (localData) {
      const jsonData: QuestionData[] = JSON.parse(localData);
      return jsonData.map(Question.fromJSON);
    }
    return [];
  }

  clearLocalStorage(){
    localStorage.removeItem('questionsData');

  }
}
