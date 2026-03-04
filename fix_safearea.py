import os
import re

directory = 'c:/Users/ASUS/Desktop/FlowersApp/app'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find the import statement from react-native
            match = re.search(r'(import\s+{)([^}]*)(\}\s+from\s+[\'"]react-native[\'"];?)', content)
            if match:
                imports_str = match.group(2)
                if 'SafeAreaView' in imports_str:
                    # Remove SafeAreaView from the list
                    imports_list = [i.strip() for i in imports_str.split(',')]
                    imports_list = [i for i in imports_list if i != 'SafeAreaView' and i != '']
                    
                    new_imports_str = ', '.join(imports_list)
                    
                    if new_imports_str:
                        new_import_stmt = f"import {{ {new_imports_str} }} from 'react-native';\nimport {{ SafeAreaView }} from 'react-native-safe-area-context';"
                    else:
                        new_import_stmt = f"import {{ SafeAreaView }} from 'react-native-safe-area-context';"
                        
                    new_content = content[:match.start()] + new_import_stmt + content[match.end():]
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {filepath}")
