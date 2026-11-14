#!/usr/bin/env python3
"""Download and validate official data, then atomically publish an immutable edition.

Writes data/carburanti/current.json and data/carburanti/editions/<week>-<revision>.json. The Astro build reads them
(src/carburanti/date.ts) and publishes the pages and the JSON under /carburanti/data/. Run `npm run build` afterwards."""
import csv, datetime as dt, hashlib, json, os, re, shutil, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path
import openpyxl
ROOT=Path(__file__).resolve().parents[2]/'data/carburanti'; RAW=ROOT/'raw'; RAW.mkdir(parents=True,exist_ok=True)
PAGE='https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en'
C={'AT':('Austria','Austria','EUR'),'BE':('Belgium','Belgia','EUR'),'BG':('Bulgaria','Bulgaria','EUR'),'HR':('Croatia','Croația','EUR'),'CY':('Cyprus','Cipru','EUR'),'CZ':('Czechia','Cehia','CZK'),'DK':('Denmark','Danemarca','DKK'),'EE':('Estonia','Estonia','EUR'),'FI':('Finland','Finlanda','EUR'),'FR':('France','Franța','EUR'),'DE':('Germany','Germania','EUR'),'GR':('Greece','Grecia','EUR'),'HU':('Hungary','Ungaria','HUF'),'IE':('Ireland','Irlanda','EUR'),'IT':('Italy','Italia','EUR'),'LV':('Latvia','Letonia','EUR'),'LT':('Lithuania','Lituania','EUR'),'LU':('Luxembourg','Luxemburg','EUR'),'MT':('Malta','Malta','EUR'),'NL':('Netherlands','Țările de Jos','EUR'),'PL':('Poland','Polonia','PLN'),'PT':('Portugal','Portugalia','EUR'),'RO':('Romania','România','RON'),'SK':('Slovakia','Slovacia','EUR'),'SI':('Slovenia','Slovenia','EUR'),'ES':('Spain','Spania','EUR'),'SE':('Sweden','Suedia','SEK')}
URLS={'gross':'https://energy.ec.europa.eu/document/download/264c2d0f-f161-4ea3-a777-78faae59bea0_en','net':'https://energy.ec.europa.eu/document/download/78311f92-68f8-4b82-b5cf-1293beeaae77_en','history':'https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en'}
def get(url):
 req=urllib.request.Request(url,headers={'User-Agent':'KMRealiPrototype/1.0 contact: local prototype'})
 with urllib.request.urlopen(req,timeout=90) as r:return r.read()
def die(s): raise ValueError(s)
def main():
 online='--download' in sys.argv
 if online:
  page=get(PAGE).decode(); (RAW/'bulletin.html').write_text(page)
  for key,label in [('gross','Prices with taxes latest prices'),('net','Prices without taxes latest prices'),('history','Price developments 2005 onwards')]:
   m=re.search(r'<a\s+href="([^"]+)"[^>]*data-untranslated-label="'+re.escape(label),page,re.I)
   if not m: die('Nu am găsit sursa '+label)
   URLS[key]=urllib.parse.urljoin(PAGE,m.group(1).replace('&amp;','&'))
   (RAW/(key+'.xlsx')).write_bytes(get(URLS[key]))
  start=(dt.date.today()-dt.timedelta(days=430)).isoformat(); end=dt.date.today().isoformat()
  fxurl=f'https://data-api.ecb.europa.eu/service/data/EXR/D..EUR.SP00.A?startPeriod={start}&endPeriod={end}&format=csvdata'
  (RAW/'fx.csv').write_bytes(get(fxurl))
 else:
  page=(RAW/'bulletin.html').read_text()
  for key,label in [('gross','Prices with taxes latest prices'),('net','Prices without taxes latest prices'),('history','Price developments 2005 onwards')]:
   m=re.search(r'<a\s+href="([^"]+)"[^>]*data-untranslated-label="'+re.escape(label),page,re.I)
   if m: URLS[key]=urllib.parse.urljoin(PAGE,m.group(1).replace('&amp;','&'))
 def latest(key):
  rows=list(openpyxl.load_workbook(RAW/(key+'.xlsx'),read_only=True,data_only=True).active.values)
  assert rows[0][0]=='in EUR' and 'Euro-super 95' in rows[0][1] and 'Automotive gas oil' in rows[0][2] and rows[1][1:3]==('1000 l','1000 l')
  date=rows[1][0].date().isoformat(); out={}
  for row in rows[2:]:
   name=row[0]
   if name not in [v[0] for v in C.values()]: continue
   if name in out: die('Țară duplicată: '+name)
   for x in row[1:3]:
    if x is not None and (not isinstance(x,(int,float)) or x<=0):die('Preț invalid: '+name)
   out[name]=[float(x) if x is not None else None for x in row[1:3]]
  if len(out)!=27: die('Acoperire neașteptată: '+str(len(out)))
  return date,out
 week,gross=latest('gross'); nw,net=latest('net')
 if nw!=week: die('Date diferite între prețurile brute și nete')
 rates={}
 with (RAW/'fx.csv').open() as f:
  for r in csv.DictReader(f):
   if r['CURRENCY'] in {'RON','HUF','CZK','DKK','PLN','SEK'} and r['OBS_VALUE']:
    rates.setdefault(r['CURRENCY'],{})[r['TIME_PERIOD']]=float(r['OBS_VALUE'])
 def rate(cur,date):
  if cur=='EUR':return [1,date]
  found=[d for d in rates.get(cur,{}) if d<=date]
  if not found:return [None,None]
  d=max(found)
  return [rates[cur][d],d] if (dt.date.fromisoformat(date)-dt.date.fromisoformat(d)).days<=5 else [None,None]
 hist=openpyxl.load_workbook(RAW/'history.xlsx',read_only=True,data_only=True)
 sheets=[]
 for tab in ['Prices with taxes','Prices wo taxes']:
  rows=hist[tab].iter_rows(values_only=True); headers=next(rows); titles=next(rows); units=next(rows)
  indices={}
  for code in C:
   for fuel,ending in [('petrol','euro95'),('diesel','diesel')]:
    matches=[i for i,h in enumerate(headers) if isinstance(h,str) and h.startswith(code+'_price_') and h.endswith('_'+ending)]
    if len(matches)!=1 or units[matches[0]]!='1000 l': die('Coloană istorică invalidă: '+code+fuel)
    indices[code,fuel]=matches[0]
  data={}
  for row in rows:
   if not isinstance(row[0],dt.datetime):continue
   date=row[0].date().isoformat()
   if date>week or date<(dt.date.fromisoformat(week)-dt.timedelta(days=380)).isoformat():continue
   if date in data:die('Săptămână duplicată '+date)
   data[date]={(c,f):row[i] if isinstance(row[i],(int,float)) and row[i]>0 else None for (c,f),i in indices.items()}
  sheets.append(data)
 if week not in sheets[0]:die('Ediția curentă lipsește din istoric')
 observations={}
 for date,prices in sheets[0].items():
  ron,fxdate=rate('RON',date)
  if not ron:die('Lipsește cursul RON pentru '+date)
  observations[date]={}
  for code,(eng,name,cur) in C.items():
   local,localdate=rate(cur,date); observations[date][code]={}
   for ix,fuel in enumerate(['petrol','diesel']):
    g=prices[code,fuel]; n=sheets[1].get(date,{}).get((code,fuel))
    if date==week:
     g=gross[eng][ix]; n=net[eng][ix]
     hg=prices[code,fuel]
     # The current bulletin supersedes a differing same-week history cell.
    valid=bool(g and n and 0<n<=g)
    observations[date][code][fuel]={'gross':g,'net':n if valid else None,'ron':ron,'fxDate':fxdate,'localRate':local,'localFxDate':localdate}
 # Refuse abrupt changes and stale/late editions; existing snapshot stays untouched.
 current=ROOT/'current.json'
 if current.exists():
  old=json.loads(current.read_text()); oldweek=old['week']
  if week<oldweek:die('Ediție mai veche decât cea publicată')
  if online and week==oldweek and (dt.date.today()-dt.date.fromisoformat(week)).days>10:die('Ediția următoare întârzie; se păstrează ultima verificată')
  if week>oldweek:
   for code in C:
    for ix,fuel in enumerate(['petrol','diesel']):
     previous=old['observations'][oldweek][code][fuel]['gross']
     if previous and gross[C[code][0]][ix] is None:die('Observație nou lipsă; revizuire necesară: '+code+' '+fuel)
   for code in C:
    for fuel in ['petrol','diesel']:
     a=old['observations'][oldweek][code][fuel]['gross']; b=observations[week][code][fuel]['gross']
     if a and b and abs(b/a-1)>0.4:die('Variație neobișnuită: '+code+' '+fuel)
 hashes={k:hashlib.sha256((RAW/(k+'.xlsx')).read_bytes()).hexdigest() for k in URLS}
 hashes['fx']=hashlib.sha256((RAW/'fx.csv').read_bytes()).hexdigest()
 revision=hashlib.sha256(json.dumps(hashes,sort_keys=True).encode()).hexdigest()[:12]
 result={'week':week,'revision':revision,'retrieved':dt.datetime.now(dt.timezone.utc).isoformat(),'sources':URLS,'hashes':hashes,'countries':{c:{'name':n,'currency':cur} for c,(_,n,cur) in C.items()},'observations':observations}
 editions=ROOT/'editions'; editions.mkdir(exist_ok=True)
 edition=editions/(week+'-'+revision+'.json')
 if not edition.exists():edition.write_text(json.dumps(result,ensure_ascii=False,separators=(',',':')))
 tmp=current.with_suffix('.tmp'); shutil.copyfile(edition,tmp); os.replace(tmp,current)
 # Archive original source files with the edition to preserve provenance and revisions.
 archive=ROOT/'sources'/revision; archive.mkdir(parents=True,exist_ok=True)
 for name in ['gross.xlsx','net.xlsx','history.xlsx','fx.csv','bulletin.html']:
  if not (archive/name).exists():shutil.copyfile(RAW/name,archive/name)
 print('Publicat:',week,revision,'săptămâni:',len(observations))
if __name__=='__main__':
 try:main()
 except Exception as e: print('ACTUALIZARE EȘUATĂ; ultima ediție rămâne activă:',e,file=sys.stderr); sys.exit(1)
