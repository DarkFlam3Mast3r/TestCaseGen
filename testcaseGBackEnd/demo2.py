from questionNodes import *
from xmindmgr import *

#问第一页的问题

df,question_dict_1 = readQuestion("demo1")
askQuestion(df,question_dict_1)

# 收集用户未跳过的所有答案
answers_dict = get_answer(df,question_dict_1)

print(answers_dict)
