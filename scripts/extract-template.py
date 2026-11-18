from pathlib import Path
import zipfile,json,re,xml.etree.ElementTree as E
root=Path(__file__).resolve().parents[1]
with zipfile.ZipFile(root/'outputs/9bc288992453/schedule-template.xlsx') as z:
    files={name:z.read(name).decode('utf-8') for name in z.namelist()}
for name,value in files.items():
    if 'xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"' in value:
        files[name]=re.sub(r'(<\/?)x:',r'\1',value).replace('xmlns:x="http://schemas.openxmlformats.org/spreadsheetml/2006/main"','xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"')
ns={'s':'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
def styles(index):
    return {v.attrib['r']:v.attrib.get('s','0') for v in E.fromstring(files[f'xl/worksheets/sheet{index}.xml']).findall('.//s:c',ns)}
a,b=styles(1),styles(2)
data={'files':files,'styles':{'title':a['A2'],'meta':a['A3'],'header':[a.get(f'{x}8','0') for x in 'ABCDEFGHIJ'],'body':[a.get(f'{x}9','0') for x in 'ABCDEFGHIJ'],'moneyTitle':b['A2'],'moneyMeta':b['A3'],'moneyHeader':[b.get(f'{x}6','0') for x in 'ABCDEF'],'moneyBody':[b.get(f'{x}7','0') for x in 'ABCDEF']}}
(root/'src/xlsx-template.json').write_text(json.dumps(data,ensure_ascii=False))
print('Extracted XLSX template for offline browser export')
