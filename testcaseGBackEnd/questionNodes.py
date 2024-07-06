import pandas as pd
import math
class QuestionNode:
    def __init__(self, question_id, question_text,parent_id):
        self.question_id = question_id
        self.question_text = question_text
        self.parent_id = parent_id
        self.sub_questions = []
        self.answer = None  # 用于存储答案

    def add_sub_question(self, sub_question):
        self.sub_questions.append(sub_question)

    def ask(self):
        print(self.question_text)
        self.answer = input("请输入答案（跳过请输入'1'）: ").strip()
        # 如果回答'跳过'，则跳过所有子问题
        if self.answer.lower() != '1':
            for sub_question in self.sub_questions:
                sub_question.ask()
        else:
            self.answer = None  # 如果跳过问题，则清除答案

    def collect_answers(self, result_dict):
        if self.answer is not None:  # 只有在问题未被跳过时才收集答案
            if math.isnan(self.parent_id):
                self.parent_id = None
            result_dict[self.question_id] = {
                'question_text': self.question_text,
                'answer': self.answer,
                'parent_id': self.parent_id,
            }
            for sub_question in self.sub_questions:
                sub_question.collect_answers(result_dict)


# def loadExcelSheet(excel_path, sheet_name, header_line=Config.EXCEL_HEAD_LABEL_LINE,
#                        content_line=Config.EXCEL_CONTENT_AFTER_LABEL_LINE):
#     excel_full_path = Config.DESIGN_BASE_PATH + excel_path  # 策划表路径
#     # 根据python版本号来适配不同的读取参数 sheet_name和sheetname
#     if version_info >= (3, 5):
#         df = pandas.read_excel(excel_full_path, header=header_line, sheet_name=sheet_name)
#     else:
#         df = pandas.read_excel(excel_full_path, header=header_line, sheetname=sheet_name)
#     df = df.drop(df.index[:content_line])
#     return df
def readQuestion(sheet_name="demo1"):
    df = pd.read_excel("questions.xlsx",skiprows=[0],sheet_name = "demo1")
    # 创建问题字典，映射问题ID到问题节点
    question_dict = {row['Question ID']: QuestionNode(row['Question ID'], row['Question Text'],row['Parent ID']) for index, row in df.iterrows()}
    for index, row in df.iterrows():
        question_id = row['Question ID']
        parent_id = row['Parent ID']
        # 如果有父问题，将当前问题添加到父问题的子问题列表中
        if not pd.isna(parent_id) and parent_id in question_dict:
            question_dict[parent_id].add_sub_question(question_dict[question_id])
    return df,question_dict

def askQuestion(df,question_dict):
    for index, row in df[df['Parent ID'].isna()].iterrows():
        question_dict[row['Question ID']].ask()
def get_answer(df,question_dict):
    answers_dict = {}
    for index, row in df[df['Parent ID'].isna()].iterrows():
        question_dict[row['Question ID']].collect_answers(answers_dict)
    return answers_dict


if __name__ == "__main__":
    # 读取Excel文件
    df = pd.read_excel("questions.xlsx",skiprows=[0],sheet_name = "demo1")

    # 创建问题字典，映射问题ID到问题节点
    question_dict = {row['Question ID']: QuestionNode(row['Question ID'], row['Question Text'],row['Parent ID']) for index, row in df.iterrows()}

    # 创建问题树
    for index, row in df.iterrows():
        question_id = row['Question ID']
        parent_id = row['Parent ID']
        # 如果有父问题，将当前问题添加到父问题的子问题列表中
        if not pd.isna(parent_id) and parent_id in question_dict:
            question_dict[parent_id].add_sub_question(question_dict[question_id])

    # 找到所有根问题，并开始问答流程
    for index, row in df[df['Parent ID'].isna()].iterrows():
        question_dict[row['Question ID']].ask()

    # 收集用户未跳过的所有答案
    answers_dict = {}
    for index, row in df[df['Parent ID'].isna()].iterrows():
        question_dict[row['Question ID']].collect_answers(answers_dict)

    # {1: {'question_text': '玩法是否包含跨服', 'answer': '', 'parent_id': nan}, 
    # 2: {'question_text': '是否是跨服副本', 'answer': '', 'parent_id': 1.0}, 3: {'question_text': '跨服副本是否有结算', 'answer': '', 'parent_id': 2.0}, 
    # 4: {'question_text': '跨服副本问 题2', 'answer': '', 'parent_id': 2.0}, 5: {'question_text': '跨服开关是否是单独配置', 'answer': '', 'parent_id': 1.0}, 
    # 6: {'question_text': '玩法是否有礼券', 'answer': '', 'parent_id': nan}}

    # 输出答案字典，查看结果
    print(answers_dict)