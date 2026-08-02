
import re

files = [
    'src/pages/BookDetail.tsx',
    'src/components/books/BookCard.tsx',
    'src/pages/admin/AdminBooks.tsx'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        continue

    content = re.sub(r'\{book\.name(?!\?)(?!\.)\}', '{book.name?.en || book.name?.ml || \'Unknown Title\'}', content)
    content = re.sub(r'\{book\.writer(?!\?)(?!\.)\}', '{book.writer?.en || book.writer?.ml || \'Unknown Author\'}', content)
    
    # Also handle the template literal in AdminBooks
    content = re.sub(r'\$\{book\.name\}', '', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

