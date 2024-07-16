from questionNodes import *
import xmind
from xmind.core.const import TOPIC_DETACHED
from xmind.core.markerref import MarkerId
from xmind.core import workbook as xworkbook
import os

def ensure_directory_exists(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)

# 创建 XMind 主题及其子主题
def create_topic(question, workbook):
    topic = workbook.createTopic()
    topic.setTitle(question['question_text'])
    if question['answer']:
        # 添加答案作为备注（注解）
        topic.setNote('Answer: ' + question['answer'])
    #添加标记（优先级，进度...）
    topic.addMarker(MarkerId.starBlue)
    return topic

def get_unique_filename(base_directory, base_filename):
    # 检查文件是否存在，如果存在则添加后缀
    counter = 1
    filename, file_extension = os.path.splitext(base_filename)
    new_filename = os.path.join(base_directory, base_filename)  # 初始文件路径
    while os.path.exists(new_filename):
        new_filename = os.path.join(base_directory, f"{filename}_{counter}{file_extension}")
        counter += 1
    return new_filename

# 递归地构建思维导图的层次结构
def build_xmind_structure(question_dict, parent_id, workbook, parent_topic=None):
    for question_id, question in question_dict.items():
        if question['parent_id'] == parent_id:
            topic = create_topic(question, workbook)
            if parent_topic:
                parent_topic.addSubTopic(topic)
            else:
                # 设置根主题
                workbook.getPrimarySheet().getRootTopic().addSubTopic(topic)
                topic.setTopicHyperlink("#" + str(question_id))
            build_xmind_structure(question_dict, question_id, workbook, topic)

# 创建 XMind 文件
def create_xmind_file(question_dict, base_directory='files', base_filename='user_answers.xmind'):
    # 确保目录存在
    ensure_directory_exists(base_directory)

    # 获取一个不会覆盖现有文件的文件名
    filename = get_unique_filename(base_directory, base_filename)


    # 创建或加载工作簿
    workbook = xmind.load(filename)  # 创建一个新的空白工作簿

    # 构建和保存XMind结构
    build_xmind_structure(question_dict, None, workbook)
    xmind.save(workbook, filename)  # 注意：确保filename包含路径
    print(f"XMind file saved as: {filename}")

if __name__ == "__main__":
	# 运行代码
	question_dict = {1: {'question_text': '玩法是否包含跨服', 'answer': '', 'parent_id': None},
	                 2: {'question_text': '是否是跨服副本', 'answer': '', 'parent_id': 1.0},
	                 3: {'question_text': '跨服副本是否有结算', 'answer': '', 'parent_id': 2.0},
	                 4: {'question_text': '跨服副本问题2', 'answer': '', 'parent_id': 2.0},
	                 5: {'question_text': '跨服开关是否是单独配置', 'answer': '', 'parent_id': 1.0},
	                 6: {'question_text': '玩法是否有礼券', 'answer': '', 'parent_id': None}}


	create_xmind_file(question_dict)

