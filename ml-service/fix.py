import re
with open(r'd:\Fake News Detection Platform\ml-service\model\fake_news_model.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('📊 ', '')
content = content.replace('✅ ', '')
content = content.replace('❌ ', '')
content = content.replace('⚠️ ', '')
content = content.replace('🔧 ', '')
content = content.replace('💾 ', '')
content = content.replace('📂 ', '')
content = content.replace('🆕 ', '')
content = content.replace('print("Loading Fake news dataset from {fake_csvs[0]}...")', 'print(f"Loading Fake news dataset from {fake_csvs[0]}...")')

with open(r'd:\Fake News Detection Platform\ml-service\model\fake_news_model.py', 'w', encoding='utf-8') as f:
    f.write(content)
