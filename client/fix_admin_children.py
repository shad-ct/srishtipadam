
import re

files = [
    'src/pages/admin/AdminEvents.tsx',
    'src/pages/admin/AdminMagazines.tsx',
    'src/pages/admin/AdminCommittee.tsx'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        continue

    content = re.sub(r'\{ev\.name(?!\?)(?!\.)\}', '{ev.name?.en || ev.name?.ml || \'Unknown Event\'}', content)
    content = re.sub(r'\{ev\.place(?!\?)(?!\.)\}', '{ev.place?.en || ev.place?.ml || \'Unknown Place\'}', content)
    content = re.sub(r'\{ev\.title(?!\?)(?!\.)\}', '{ev.title?.en || ev.title?.ml || \'Unknown Event\'}', content)
    content = re.sub(r'\$\{ev\.name\}', '', content)
    
    content = re.sub(r'\{mag\.title(?!\?)(?!\.)\}', '{mag.title?.en || mag.title?.ml || \'Unknown Magazine\'}', content)
    content = re.sub(r'\$\{mag\.title\}', '', content)

    content = re.sub(r'\{member\.name(?!\?)(?!\.)\}', '{member.name?.en || member.name?.ml || \'Unknown Member\'}', content)
    content = re.sub(r'\{member\.role(?!\?)(?!\.)\}', '{member.role?.en || member.role?.ml || \'Unknown Role\'}', content)
    content = re.sub(r'\$\{member\.name\}', '', content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

