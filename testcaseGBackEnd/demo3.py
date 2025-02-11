import pandas as pd
import json

# 定义树节点类
class TreeNode:
    def __init__(self, id, QuestionText, ChoiceText, parent_id, question_type, include, related_bug, notice, content,active=True):
        self.id = id
        self.QuestionText = QuestionText
        self.ChoiceText = ChoiceText
        self.parent_id = parent_id
        self.question_type = question_type
        self.include = include
        self.related_bug = related_bug
        self.notice = notice
        self.content = content
        self.children = []
        self.active = active

    def to_dict(self):
        return {
            'id': self.id,
            'QuestionText': self.QuestionText,
            'ChoiceText': self.ChoiceText,
            'question_type': self.question_type,
            'include': self.include,
            'related_bug': self.related_bug,
            'notice': self.notice,
            'content': self.content,
            'active':self.active,
            'children': [child.to_dict() for child in self.children],
            
        }

# 读取Excel数据
# df = pd.read_excel('questions.xlsx')
df = pd.read_excel("questions.xlsx",skiprows=[0],sheet_name = "排行榜demo")
# 用空字符串替换NaN值
df = df.fillna('')
# 构建字典以存储所有节点
nodes = {}

# 初始化所有节点并存储在字典中

for _, row in df.iterrows():
    node = TreeNode(
        id=row['ID'],
        QuestionText=row['QuestionText'],
        ChoiceText=row['ChoiceText'],
        parent_id=row['ParentID'],
        question_type=row['QuestionType'],
        include=row['include'],
        related_bug=row['bugs'],
        notice=row['checklist'],
        content=row['rootContent']
    )
    nodes[row['ID']] = node
    print(f"创建节点：{node.to_dict()}")

# 构建树状结构
# 构建树状结构
root = None
for node in nodes.values():
    if node.parent_id == '':
        root = node
    else:
        parent = nodes.get(node.parent_id)
        if parent:
            parent.children.append(node)
    print(f"节点 {node.id} 的父节点为 {node.parent_id}")  # 输出每个节点的父节点信息

# 将树状结构转换为JSON格式
if root:
    tree_dict = root.to_dict()
    json_output = json.dumps(tree_dict, ensure_ascii=False, indent=2)
    print(json_output)
else:
    print("未找到根节点")
