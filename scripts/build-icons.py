from pathlib import Path
from PIL import Image,ImageDraw
import json
root=Path(__file__).resolve().parents[1]
folder=root/'icon';folder.mkdir(exist_ok=True)
def draw_icon(size,maskable=False,apple=False):
    scale=8;image=Image.new('RGBA',(size*scale,size*scale),(0,0,0,0));d=ImageDraw.Draw(image)
    bg='#285344';gold='#f6d58c';w=size*scale
    if maskable or apple:d.rectangle((0,0,w,w),fill=bg)
    else:d.rounded_rectangle((0,0,w-1,w-1),radius=w*15/64,fill=bg)
    logo_scale=.78 if maskable else 1
    def xy(x,y):return ((32+(x-32)*logo_scale)*w/64,(32+(y-32)*logo_scale)*w/64)
    def line(points,width):
        pts=[xy(*p) for p in points];width=max(1,round(width*w/64*logo_scale));d.line(pts,fill=gold,width=width,joint='curve')
        for x,y in [pts[0],pts[-1]]:d.ellipse((x-width/2,y-width/2,x+width/2,y+width/2),fill=gold)
    curve=[]
    for i in range(101):
        t=i/100;curve.append(((1-t)**2*11+2*(1-t)*t*32+t*t*53,(1-t)**2*17+2*(1-t)*t*23+t*t*17))
    line(curve,5);line([(16,29),(48,29)],4);line([(22,22),(22,49)],5);line([(42,22),(42,49)],5);line([(32,23),(32,28)],4)
    return image.resize((size,size),Image.Resampling.LANCZOS)
for size in [16,32,48,192,512]:draw_icon(size).save(folder/f'favicon-{size}.png' if size<100 else folder/f'icon-{size}.png')
draw_icon(180,apple=True).save(folder/'apple-touch-icon.png')
draw_icon(512,maskable=True).save(folder/'maskable-512.png')
draw_icon(64).save(folder/'favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48),(64,64)])
manifest={'id':'./','name':'鎌倉たびクエスト','short_name':'鎌倉たび','lang':'ja','start_url':'./','scope':'./','display':'standalone','background_color':'#f7f6ef','theme_color':'#285344','icons':[{'src':'./icon/icon-192.png','sizes':'192x192','type':'image/png','purpose':'any'},{'src':'./icon/icon-512.png','sizes':'512x512','type':'image/png','purpose':'any'},{'src':'./icon/maskable-512.png','sizes':'512x512','type':'image/png','purpose':'maskable'}]}
(root/'site.webmanifest').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print('Created GitHub Pages icon folder and relative-path manifest')
