import os

# 获取当前脚本的绝对路径
current_dir = os.path.dirname(os.path.abspath(__file__))

# 定义输出文件的路径
output_path = os.path.join(current_dir, 'output.txt')

# 生成文件
with open(output_path, 'w') as file:
    file.write('This is a generated file.\n')
    file.write('Python script executed successfully.')

print(f'File generated at: {output_path}')