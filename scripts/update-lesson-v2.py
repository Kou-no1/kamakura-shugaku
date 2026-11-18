from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
path=root/'src/lesson.json'
lesson=json.loads(path.read_text())
shrine='https://www.hachimangu.or.jp/sightseeing/keidai/'
history='https://www.city.kamakura.kanagawa.jp/kouhou/kamakura/h30/t181215-7.html'
chapters=[
 {'id':'genji-pond','title':'源氏池：三つの島にこめた願い','location':'参道の東側・源氏池','kind':'名前にこめられた意味','body':'参道の東側にあるのが源氏池です。鶴岡八幡宮の案内では、三つの島の「三」を「産」に重ね、源氏の繁栄を願ったと説明されています。池や島の配置にも、当時の人々の思いが表れています。','question':'池の島を数えてみよう。まちや庭の形に願いをこめるのは、どんな気持ちからだろう？','source':shrine},
 {'id':'heike-pond','title':'平家池：源氏池と比べてみよう','location':'参道の西側・平家池','kind':'伝えられている意味','body':'参道の西側が平家池です。四つの島の「四」と「死」の音を重ね、平家の衰退を願ったという説明が伝わっています。源氏池と平家池を一緒に見て、源氏と平家が争った時代の人々の思いを考えてみよう。','question':'二つの池は、参道をはさんでどのように向かい合っている？ 名前と島の数を比べてみよう。','source':shrine},
 {'id':'taiko-bridge','title':'太鼓橋：正面と横から形を見よう','location':'三の鳥居の先・池の間','kind':'形と位置の観察','body':'太鼓橋は、池の間にかかる大きく反った橋です。正面から見ると、本宮へ続く参道とのつながりがわかります。横からは、橋がえがく曲線を観察できます。見学できる場所から、見る向きによる形の違いを比べよう。','question':'太鼓橋とまっすぐな橋では、見え方や歩きやすさがどう違いそう？ 柵や通行の表示も確かめよう。','source':'https://www.trip-kamakura.com/facility/detail.php?id=54'},
 {'id':'yabusame','title':'流鏑馬馬場：馬と弓の技を想像しよう','location':'参道を横切る流鏑馬馬場','kind':'武士の技と神事','body':'流鏑馬は、走る馬に乗ったまま的に矢を射る神事です。境内には、その舞台となる長い馬場があります。馬の速さ、体のバランス、矢を射る動きを重ねて想像すると、武士に求められた技が見えてきます。','question':'馬場の長さを地図で確かめよう。馬に乗った人や見物する人には、どんな場所が必要だろう？','source':'https://www.hachimangu.or.jp/matsuri/'},
 {'id':'pigeon-eight','title':'本宮の楼門：「八」にかくれた鳩を探そう','location':'大石段の上・本宮の楼門の額','kind':'文字や飾りの観察','body':'楼門の額にある「八幡宮」の「八」をよく見ると、二羽の鳩の形が見えてきます。鳩は、八幡さまのお使いとして大切にされてきました。文字や建物の飾りにも、神社と生き物のつながりが表れています。','question':'二羽の鳩はどちらを向いている？ 文字として読むときと、絵として見るときの違いを話し合おう。','source':'https://www.hachimangu.or.jp/pray/omamori.html'},
 {'id':'sanetomo','title':'大石段：実朝と公暁の事件を知ろう','location':'本宮へ上がる大石段','kind':'史料と伝承を分けて読む','body':'1219年、鎌倉幕府の三代将軍・源実朝は、鶴岡八幡宮で公暁に襲われ、命を落としました。公暁は二代将軍・源頼家の子で、実朝のおいにあたります。鎌倉市の資料は、『吾妻鏡』に公暁が「石段の陰」から出てきたと記されていることを紹介しています。','detail':'公暁が大イチョウに隠れていたという話も語られています。この話と、史料で確かめられる記述を分けて読み、どの資料に何が書かれているのかを比べよう。','question':'実朝・頼家・公暁の関係を図にしてみよう。史料にあることと、後に伝えられた話をどう区別できる？','source':history},
 {'id':'great-ginkgo','title':'大イチョウ：倒れても続く命を見つけよう','location':'大石段のそば・親銀杏と子銀杏','kind':'今の姿と昔の写真を比べる','body':'大イチョウは、2010年3月10日に強風で倒れました。今は、移された幹の「親銀杏」と、もとの根元から伸びたひこばえの「子銀杏」が育っています。昔の大きな木の写真と今の姿を比べ、木の命がどのようにつながっているか考えてみよう。','question':'親銀杏と子銀杏を見分ける手がかりは？ 歴史を伝える場所を、これからどう守っていきたい？','source':shrine}
]
for p in lesson['places']:
 if p['id']=='hachiman':
  p['headline']='七つの発見で、境内探検を完成させよう'
  p['story']='鶴岡八幡宮の境内には、池・橋・馬場・建物・木など、歴史を学ぶ手がかりがたくさんあります。見出しから一つずつ開き、読んだことや観察したことを確かめよう。七つすべてを学習すると進み具合が100％になり、見学終了スタンプを押せます。'
  p['chapters']=chapters
new=[
 {'id':'zeniarai','name':'銭洗弁財天宇賀福神社','mapName':'銭洗弁財天','lat':35.32581,'lng':139.54225,'category':'history','headline':'水と祈りのつながりを調べよう','story':'銭洗弁財天は、岩の間から湧く水と結びついた神社です。頼朝の夢のお告げから始まったという話や、北条時頼が銭を洗って祈ったという話が伝わっています。伝えられた物語と、今も続く人々の祈りを分けて考えてみよう。','question':'人々は水で銭を洗うことに、どんな願いをこめてきたのだろう？ 水が湧く場所の地形にも注目しよう。','tip':'参拝の順序や銭を洗う方法は現地の案内で確かめよう。坂道を含むので歩く時間も考えよう。','source':'https://www.trip-kamakura.com/facility/detail.php?id=48','itemName':'清らかな水のしおり','itemDescription':'水と人々の祈りのつながりを考えた証。','itemType':'shell'},
 {'id':'genjiyama','name':'源氏山公園','lat':35.32485,'lng':139.54628,'category':'nature','headline':'山の上から武士のまちを考えよう','story':'源氏山公園には、源頼朝の像や緑に囲まれた広場があります。近くには仮粧坂があり、北鎌倉や大仏方面へ向かう山道にもつながっています。山に囲まれた鎌倉で、人々がどこを通ってまちに出入りしたのか、地図を手がかりに考えよう。','question':'山の上と駅の周りでは、道の向きや歩きやすさがどう違う？ 集合時刻に間に合う計画を考えよう。','tip':'坂や起伏があるので、班の歩く速さをそろえよう。休憩と見学に使う時間も自分たちで見積もろう。','source':'https://www.city.kamakura.kanagawa.jp/koen/p_genjiyama.html','itemName':'頼朝の山のメダル','itemDescription':'山の地形とまちの出入り口を考えた証。','itemType':'leaf'},
 {'id':'kewaizaka','name':'仮粧坂切通','lat':35.3269,'lng':139.5461,'category':'history','headline':'山を切り開いた道を見つけよう','story':'仮粧坂は、鎌倉と外の土地を結ぶ道の一つで、坂を上ると源氏山公園へつながります。「化粧坂」とも書き、読み方には「けわいざか」「けはいざか」があります。切通とは、山の尾根などを切り開いて通れるようにした道です。交通とまちの守りの両方から、道の意味を考えよう。','question':'山を切り開いた道は、人や物の移動にどんな役割を果たした？ 今の道と比べてみよう。','tip':'石や土が露出した滑りやすい坂です。現地へ行く計画は、先生の下見や最新の通行案内を確かめてから立てよう。','source':'https://www.trip-kamakura.com/facility/detail.php?id=168','itemName':'切通の探検メダル','itemDescription':'昔の道と地形の関係を見つけた証。','itemType':'medal'},
 {'id':'daibutsu-pass','name':'大仏切通','lat':35.31878,'lng':139.53153,'category':'history','headline':'山道に残る昔の道をたどろう','story':'大仏切通は、長谷から常盤を経て藤沢方面へ通じる古い道です。両側に岩や崖が迫る場所があり、狭く急な古道の様子が残っています。葛原岡・大仏ハイキングコースの終わり近くの分岐から、切通方面へ向かうこともできます。','question':'道の幅や坂の急さは、荷物を運ぶ人や馬の移動にどう影響しただろう？','tip':'自然の山道と急な場所を含みます。実際の分岐や通行できる区間は、先生と公式地図で確認しよう。','source':'https://www.trip-kamakura.com/facility/detail.php?id=176','itemName':'古道の巻物','itemDescription':'山道に残る交通の歴史を調べた証。','itemType':'scroll'}
]
new_ids={p['id'] for p in new}
lesson['places']=[p for p in lesson['places'] if p['id'] not in new_ids]
for p in new:p.update(photos=[],fee=None,chapters=[])
lesson['places'].extend(new)
lesson['edges']=[e for e in lesson['edges'] if e['a'] not in new_ids and e['b'] not in new_ids]
for a,b,terrain in [('kamakura','zeniarai','road'),('kamakura','kewaizaka','road'),('kewaizaka','genjiyama','hike'),('genjiyama','zeniarai','road'),('genjiyama','daibutsu-pass','hike'),('daibutsu-pass','daibutsu','hike')]:lesson['edges'].append({'a':a,'b':b,'mode':'walk','terrain':terrain})
lesson['routes']=[
 {'id':'genji-pass','title':'鎌倉駅から仮粧坂・源氏山へ','stops':['kamakura','kewaizaka','genjiyama','zeniarai','kamakura'],'terrain':'短い山道と坂道を含む','intro':'鎌倉駅西口から英勝寺付近を経て仮粧坂へ向かい、源氏山公園と銭洗弁財天を巡る考え方です。駅への帰り道も含めて、見学と休憩の時間を計画しよう。','inquiry':'切通へ向かう道と、駅へ戻る道を公式地図で探そう。坂道や立ち止まる時間を、どのように見積もる？','source':'https://education.trip-kamakura.com/','notice':'学習用の見学順の提案です。山道・滑りやすい坂があるため、実際に歩く前に先生が通行情報と現地の道を確かめます。'},
 {'id':'daibutsu-hike','title':'鎌倉駅から山道を通って大仏切通へ','stops':['kamakura','zeniarai','genjiyama','daibutsu-pass','daibutsu','hase'],'terrain':'長い山道・分岐・急な道を含む','intro':'鎌倉駅西口から銭洗弁財天・源氏山公園へ進み、葛原岡・大仏ハイキングコースの大仏方面と切通方面への分岐を調べるコースです。切通を見学した後、大仏や長谷駅へ向かう道を計画しよう。','inquiry':'駅から公園までの道と、公園から先の山道を分けて調べよう。班の体力・休憩・集合時刻を考えると、このルートを選べる？','source':'https://www.trip-kamakura.com/model_course/detail.php?id=45','notice':'公式の掲載コースは北鎌倉駅発です。ここでは鎌倉駅から源氏山へ合流する学習案として紹介しています。所要時間をそのまま流用せず、分岐・通行状況・下見を先生と確認しよう。'}
]
lesson['version']=2
path.write_text(json.dumps(lesson,ensure_ascii=False,indent=2))
print('Updated: 7 precinct chapters, 23 places, 2 inquiry routes')
