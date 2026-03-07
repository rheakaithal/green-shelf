import re
import os

filepath = r'c:\Users\kaith\green-shelf\components\inventoryPage.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace class="..." with className="..."
content = re.sub(r'\bclass\s*=\s*(["\'])', r'className=\1', content)
# Fix for... to htmlFor...
content = re.sub(r'\bfor\s*=\s*(["\'])', r'htmlFor=\1', content)
# Fix charset... to charSet...
content = re.sub(r'\bcharset\s*=\s*(["\'])', r'charSet=\1', content)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("done")
