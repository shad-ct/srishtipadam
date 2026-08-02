
import re

with open('src/pages/Home.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix featuredBook
content = re.sub(r'featuredBook\.name\?\.en \|\| featuredBook\.name(?!(?:\|\.|\?))', 'featuredBook.name?.en || featuredBook.name?.ml || \'Featured Book\'', content)
content = re.sub(r'featuredBook\.writer\?\.en \|\| featuredBook\.writer(?!(?:\|\.|\?))', 'featuredBook.writer?.en || featuredBook.writer?.ml', content)

# Fix book
content = re.sub(r'book\.name\?\.en \|\| book\.name(?!(?:\|\.|\?))', 'book.name?.en || book.name?.ml || \'Book\'', content)
content = re.sub(r'book\.writer\?\.en \|\| book\.writer(?!(?:\|\.|\?))', 'book.writer?.en || book.writer?.ml', content)

# Fix mag
content = re.sub(r'mag\.title\?\.en \|\| mag\.title(?!(?:\|\.|\?))', 'mag.title?.en || mag.title?.ml', content)

# Fix ev
content = re.sub(r'ev\.title\?\.en \|\| ev\.title(?!(?:\|\.|\?))', 'ev.title?.en || ev.title?.ml', content)

with open('src/pages/Home.tsx', 'w', encoding='utf-8') as f:
    f.write(content)


