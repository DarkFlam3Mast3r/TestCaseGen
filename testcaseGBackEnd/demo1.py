import pandas as pd
from IPython.display import display
#import xmind
testcaseName="测试用例"
#读取excel数据
dataframe = pd.read_excel("questions.xlsx",skiprows=[0],sheet_name = "demo1")
display(dataframe)

#找到根问题
df2 = dataframe[dataframe['previous'].isna()]
nodes = {}
#问问题
def askQuestion(q):
	question =  dataframe.loc[dataframe['question']==q]
	if question['subQuestion'].isna().bool():
		return
	else:
		nextID = question['subQuestion'].values[0]
		nextQuestion = dataframe[dataframe['id']==nextID]
		print(nextQuestion['question'].values[0])
		x = input()
		if x == "1":
			#添加子节点
			askQuestion(nextQuestion['question'].values[0])


w = xmind.load("test.xmind")
s1 = w.getPrimarySheet()
s1.setTitle(testcaseName)
r1 = s1.getRootTopic() 
r1.setTitle(testcaseName)

questions = df2["name"].values #根问题s
for question in questions:
	print(question)
	x = input()
	if x == "1":
		askQuestion(question)
		#添加子节点，node的key
		if question not in nodes:
			nodes[question]=[]


#答题

#整理数据

#查找节点
def find_topic_by_title(topic, title):
	"""
	递归搜索具有给定标题的主题。
	:param topic: 当前搜索的主题（节点）
	:param title: 要查找的标题
	:return: 找到的主题或者None
	"""
	if topic.getTitle() == title:
		return topic
	for sub_topic in topic.getSubTopics() or []:  # getSubTopics()可能返回None，所以使用or []
		result = find_topic_by_title(sub_topic, title)
		if result:
			return result
	return None

#search_title = "Subtopic 1"
#found_topic = find_topic_by_title(root_topic, search_title)


#生成xmind
def generateXmind():
	import xmind
	
	w = xmind.load("test.xmind")
	s1 = w.getPrimarySheet()  # 获取此工作表
	s1.setTitle(testcaseName)  # 设置标题
	a = {"h1": 'Python 技术学习', 'h2': ['Python基础', 'Python 爬虫'],
		'h3': [['Python环境安装', 'Python基础语法', 'Python数据结构'], ['Python爬虫基础知识详解', 'Python爬虫相关模块详解']]}
	r1 = s1.getRootTopic()  # 获取此工作表的根主题
	r1.setTitle(a['h1'])  # 设置标题
	c = a['h2']
	c2 = a['h3']
	for i, val in enumerate(c):
		print(i, val)
		a = 'b' + str(i)
		a = r1.addSubTopic()
		a.setTitle(val)  # 设置标题
		for i2, val2 in enumerate(c2):
			if i == i2:
				a2 = 'b2' + str(i)
				a2 = a.addSubTopic()
				#        if isinstance(val, list):
				for i3, val3 in enumerate(val2):
					a3 = 'b3' + str(i3)
					a3 = a2.addSubTopic()
					a3.setTitle(val3)
	
	xmind.save(w, "Python_detail2.xmind")