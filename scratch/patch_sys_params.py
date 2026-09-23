with open('frontend/src/apps/system/pages/lists/SystemParameters.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace(
'''            if (editing === \'new\') {
                // Mock endpoint doesn\'t strictly have a " create endpoint,
