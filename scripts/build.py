from pathlib import Path
import json,shutil,urllib.parse
root=Path(__file__).resolve().parents[1]
lesson=json.loads((root/'src/lesson.json').read_text())
css=(root/'src/style.css').read_text()+'\n'+(root/'src/learning.css').read_text()
template=(root/'src/xlsx-template.json').read_text().replace('<','\\u003c')
readings=(root/'src/ruby-dictionary.json').read_text().replace('<','\\u003c')
app=(root/'src/app.js').read_text().replace('// @LEARNING@',(root/'src/learning.js').read_text()).replace('// @EXTRAS@',(root/'src/extras.js').read_text())
js=(root/'src/core.js').read_text()+'\n'+(root/'src/schedule.js').read_text()+'\nglobalThis.KRDictionary='+readings+';\n'+(root/'src/ruby.js').read_text()+'\nconst KQTemplate='+template+';\n'+app
data=json.dumps(lesson,ensure_ascii=False).replace('<','\\u003c')
icon='data:image/svg+xml,'+urllib.parse.quote((root/'icon/favicon.svg').read_text(),safe='')
head=f'''<!doctype html>
<html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#285344"><meta name="description" content="歴史と自然を学び、地図を探検して班の予定を考える修学旅行サイト。">
<meta name="apple-mobile-web-app-title" content="鎌倉たびクエスト">
<title>鎌倉たびクエスト｜旅のじゅんびを、冒険に。</title>
<link rel="icon" href="{icon}" id="embedded-favicon">
<link rel="shortcut icon" href="./icon/favicon.ico" data-external-icon>
<link rel="icon" type="image/png" sizes="16x16" href="./icon/favicon-16.png" data-external-icon>
<link rel="icon" type="image/png" sizes="32x32" href="./icon/favicon-32.png" data-external-icon>
<link rel="icon" type="image/svg+xml" href="./icon/favicon.svg" data-external-icon>
<link rel="apple-touch-icon" sizes="180x180" href="./icon/apple-touch-icon.png" data-external-icon>
<link rel="manifest" href="./site.webmanifest" data-external-icon>
<style>'''
html=head+css+'''</style></head><body><div id="app"></div><div id="modal-root"></div><div id="toast" role="status" aria-live="polite"></div><noscript>このサイトをつかうには JavaScript をゆうこうにしてください。</noscript><script id="lesson-data" type="application/json">'''+data+'''</script><script>'''+js+'''</script></body></html>'''
(root/'dist').mkdir(exist_ok=True)
(root/'dist/index.html').write_text(html)
(root/'index.html').write_text(html)
(root/'.nojekyll').touch();(root/'dist/.nojekyll').touch()
shutil.copytree(root/'icon',root/'dist/icon',dirs_exist_ok=True)
shutil.copy2(root/'site.webmanifest',root/'dist/site.webmanifest')
print(f'Built index.html ({len(html.encode()):,} bytes) with icon/ and manifest')
