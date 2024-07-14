export interface QuestionData {
  id: number;
  QuestionText: string;
  ChoiceText: string;
  question_type: number;
  include: string;
  related_bug: string;
  notice: string;
  content: string;
  active: boolean;
  children: QuestionData[];
  answer?: string;
}

export class Question {
  constructor(
    public id: number,
    public QuestionText: string,
    public ChoiceText: string[],
    public answer?: string,
    public question_type?: number,
    public include?: string,
    public related_bug?: string,
    public checklists?: string,
    public content?: string,
    public active?: boolean,
    public children: Question[] = []
  ) {
    this.id = id;
    this.QuestionText = QuestionText;
    this.ChoiceText = ChoiceText;
    this.answer = answer;
    this.question_type = question_type ?? 0;
    this.include = include ?? '';
    this.related_bug = related_bug ?? '';
    this.checklists = checklists ?? '';
    this.content = content ?? '';
    this.active = active ?? false;
  }

  static fromJSON(data: QuestionData): Question {
    if (!data) {
      throw new Error('Invalid data: cannot convert undefined to Question');
    }
    const children = data.children.map((child) => Question.fromJSON(child));
    const question = new Question(
      data.id,
      data.QuestionText,
      data.ChoiceText.split('；'),
      data.answer || '',
      data.question_type,
      data.include,
      data.related_bug,
      data.notice,
      data.content,
      data.active,
      children
    );
    return question;
  }

  static collectAllQuestions(question: Question): Question[] {
    const result: Question[] = [question];
    for (const child of question.children) {
      result.push(...Question.collectAllQuestions(child));
    }
    return result;
  }

  setActive(status: boolean): void {
    this.active = status;
    for (const child of this.children) {
      child.setActive(status);
    }
  }
  setChildrenActive(status: boolean): void {
    console.log(this.children);
    for (const child of this.children) {
      child.active = status;
      child.setChildrenActive(status); // Recursively set the status for all descendants
    }
  }

  setDirectChildrenActive(status: boolean): void {
    for (const child of this.children) {
      child.active = status; // Set active status for direct children only
    }
  }

  setChildrenActiveBasedOnCondition(
    condition: (question: Question) => boolean
  ): void {
    for (const child of this.children) {
      child.active = condition(child);
      child.setChildrenActiveBasedOnCondition(condition);
    }
  }
  static findRootQuestions(questions: Question[]): Question[] {
    const childrenSet = new Set<number>();
    for (const question of questions) {
      for (const child of question.children) {
        childrenSet.add(child.id);
      }
    }
    return questions.filter((question) => !childrenSet.has(question.id));
  }
  static transformToNewFormat(root: Question): any {
    const transform = (question: Question): any => {
      let include = question.include;
      if (!question.active) {
        return null; // Skip if active is false
      }
      if (question.question_type == 1 && question.answer == '否') {
        return null;
      }
      if (question.question_type == 3 && question.answer == '否') {
        return null;
      }
      if (question.answer == undefined || question.answer == '') {
        return null;
      }
      if (question.question_type == 2) {
        let theChosenOne = question.answer;
        let includes = question.include.split('；');
        console.log('转换给d3');
        for (let inc of includes) {
          if (inc.includes(theChosenOne)) {
            include = inc;
          }
        }
        console.log(question.include);
      }

      const combinedText = question.answer
        ? `${question.QuestionText} ${question.answer}`
        : question.QuestionText;

      const children = question.children
        .map((child) => transform(child))
        .filter((child) => child !== null); // Filter out inactive children

      for (let x of include.split('+')) {
        if (question.include) {
          children.push({
            name: x,
          });
        }
      }

      return {
        name: combinedText,
        children: children.length ? children : undefined,
      };
    };

    return transform(root);
  }

  toJSON(): any {
    return {
      id: this.id,
      QuestionText: this.QuestionText,
      ChoiceText: this.ChoiceText.join('；'), // Convert array back to string
      answer: this.answer,
      question_type: this.question_type,
      include: this.include,
      related_bug: this.related_bug,
      checklists: this.checklists,
      content: this.content,
      active: this.active,
      children: this.children.map((child) => child.toJSON()),
    };
  }
}

// JSON data
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

// const rootQuestion = Question.fromJSON(jsonData);
// rootQuestion.active = true; // Set root question active status to true

// // Example usage: Set active to true or false for all children based on a condition
// rootQuestion.setChildrenActive(false); // Set all children to inactive
// const allQuestions = Question.collectAllQuestions(rootQuestion);
// const rootQuestions = Question.findRootQuestions(allQuestions);
// for (const question of rootQuestions) {
//   question.active = true; // Set active to true for all root questions
// }
