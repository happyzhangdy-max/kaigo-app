# -*- coding: utf-8 -*-
import sys, json
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

terms = json.load(open('i18n/terms.json', 'r', encoding='utf-8'))
qs = json.load(open('data/questions.json', 'r', encoding='utf-8'))

print(f'=== 术语表 ===')
print(f'总术语数: {len(terms)}')

# Count by subject category
subjects = {}
for q in qs:
    s = q['subject']
    subjects[s] = subjects.get(s, 0) + 1

print(f'\n=== 题库 ===')
print(f'总题数: {len(qs)}')
print(f'科目分布:')
for s, c in sorted(subjects.items()):
    print(f'  {s}: {c} 题')

# Check all questions have zh_explanation
missing_zh = [q['id'] for q in qs if not q.get('zh_explanation')]
print(f'\n缺少zh_explanation的题: {len(missing_zh)}')

# Check all questions have correct structure
errors = []
for q in qs:
    if not all(k in q for k in ['id', 'subject', 'question', 'choices', 'correct', 'ja_explanation', 'zh_explanation']):
        errors.append(q['id'])
print(f'结构错误的题: {len(errors)}')

# Check term_refs match existing terms
term_keys = set(terms.keys())
for q in qs:
    for ref in q.get('term_refs', []):
        if ref and ref not in term_keys:
            print(f'  注意: 题 {q["id"]} 引用了不存在的术语 "{ref}"')

# Check difficulty distribution
diffs = {}
for q in qs:
    d = q.get('difficulty', 'unknown')
    diffs[d] = diffs.get(d, 0) + 1
print(f'\n难度分布:')
for d, c in sorted(diffs.items()):
    print(f'  {d}: {c}')
