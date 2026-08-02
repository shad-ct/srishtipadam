import re
import sys

files = [
    'src/App.tsx',
    'src/components/layout/Footer.tsx',
    'src/components/layout/Navbar.tsx',
    'src/data/data.ts',
    'src/pages/About.tsx',
    'src/pages/admin/AdminCommittee.tsx',
    'src/pages/admin/AdminDashboard.tsx',
    'src/pages/admin/AdminLayout.tsx',
    'src/pages/BookDetail.tsx',
    'src/pages/Books.tsx',
    'src/pages/Committee.tsx',
    'src/pages/Events.tsx',
    'src/pages/Join.tsx',
    'src/pages/Magazines.tsx',
    'src/router.tsx'
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
    except FileNotFoundError:
        continue
    
    # Remove unused React
    content = re.sub(r"import React from 'react';\n", "", content)
    content = re.sub(r"import React, \{([^}]+)\} from 'react';", r"import {\1} from 'react';", content)
    
    # Specific fixes
    if 'Footer.tsx' in f:
        content = re.sub(r"const \{ t \} = useTranslation\(\);\n", "", content)
    if 'Navbar.tsx' in f:
        content = re.sub(r"import logo from '../../assets/logo.png';\n", "", content)
    if 'data.ts' in f:
        content = re.sub(r"const SrishtipadhamData = \{\n(?:.*?\n)*?\};\n", "", content)
    if 'AdminCommittee.tsx' in f:
        content = re.sub(r"import \{ useState, useEffect \} from 'react';", "import { useState } from 'react';", content)
    if 'BookDetail.tsx' in f:
        content = re.sub(r"const \{ t, i18n \} = useTranslation\(\);", "const { i18n } = useTranslation();", content)
    if 'Books.tsx' in f:
        content = re.sub(r"\s*const lang = i18n\.language as 'ml' \| 'en';\n", "\n", content)
    if 'Join.tsx' in f:
        content = re.sub(r"\s*const \{ t \} = useTranslation\(\);\n", "\n", content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Done")
