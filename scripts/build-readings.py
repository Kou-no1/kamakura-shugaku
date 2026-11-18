"""Build-only tokenizer. The website uses the generated reading data offline."""
from pathlib import Path
import json,re,sys,collections
try:
    from janome.tokenizer import Tokenizer
except ImportError:
    sys.path.insert(0,'/tmp/kamakura-ruby-tools')
    from janome.tokenizer import Tokenizer
root=Path(__file__).resolve().parents[1]
tokenizer=Tokenizer()
kanji=re.compile(r'[\u3400-\u9fff々]')
japanese=re.compile(r'[\u3400-\u9fff々ぁ-ゖァ-ヺー]+')
def hiragana(s):return ''.join(chr(ord(c)-96) if 'ァ'<=c<='ヶ' else c for c in s)
texts=[]
def collect(v):
    if isinstance(v,str):texts.append(v)
    elif isinstance(v,list):
        for x in v:collect(x)
    elif isinstance(v,dict):
        for x in v.values():collect(x)
collect(json.loads((root/'src/lesson.json').read_text()))
for name in ['app.js','extras.js','learning.js','core.js','schedule.js']:
    texts.extend(japanese.findall((root/'src'/name).read_text()))
counts=collections.defaultdict(collections.Counter)
for text in set(texts):
    for token in tokenizer.tokenize(text):
        if kanji.search(token.surface) and token.reading!='*':counts[token.surface][hiragana(token.reading)]+=1
readings={key:counter.most_common(1)[0][0] for key,counter in counts.items()}
overrides=json.loads((root/'src/ruby-overrides.json').read_text())
readings.update({k:v for k,v in overrides.items() if kanji.search(k)})
# Ensure even infrequently used characters have a reading; full words win first.
for text in set(texts):
    for c in set(kanji.findall(text)):
        if c not in readings:
            token=next(tokenizer.tokenize(c))
            if token.reading!='*':readings[c]=hiragana(token.reading)
(root/'src/ruby-dictionary.json').write_text(json.dumps(readings,ensure_ascii=False,sort_keys=True))
print(f'Built offline ruby readings: {len(readings)} entries')
