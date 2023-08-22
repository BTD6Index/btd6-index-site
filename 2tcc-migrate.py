from googleapiclient.discovery import build
import glob
from google.oauth2 import service_account
import re
import migrationutils as mu
import json
import uuid

SPREADSHEET_ID = '16of-RFUD1FteVchU9S4vAht39nlh1iraeoNA4u3R9cw'

ALT_MAPS_REGEX = r'^(?P<map>[^:]*?)\s*:\s*(?P<person1>[^,]*?)\s*,\s*(?P<person2>[^,]*?)\s*,\s*(?P<link>[^\s]*)'

creds_file = glob.glob('google_service_creds/*.json')[0]
creds = service_account.Credentials.from_service_account_file(creds_file)
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()
res = sheet.get(
    spreadsheetId = SPREADSHEET_ID,
    ranges = '2TCC!B12:O196',
    fields = 'sheets/data/rowData/values/note,sheets/data/rowData/values/hyperlink,sheets/data/rowData/values/formattedValue'
    ).execute()['sheets'][0]['data'][0]['rowData']

with open('src/util/maps.json', 'rb') as mapsJson:
    fullNameToAbbrev = json.load(mapsJson)
abbrevToFullName = {v: k for k, v in fullNameToAbbrev.items()}

sql_statements = []

for row in res:
    tower1 = mu.sql_escape(mu.standardize_entity(row['values'][1]['formattedValue']))
    tower2 = mu.sql_escape(mu.standardize_entity(row['values'][3]['formattedValue']))
    upgrade1, upgrade2 = [mu.sql_escape(v) for v in re.split(r'\s*\|\s*', row['values'][5]['formattedValue'])]
    ogMap = mu.sql_escape(row['values'][7]['formattedValue'])
    altMapNotes = row['values'][7].get('note', None)
    version = mu.sql_escape(row['values'][8]['formattedValue'])
    date = mu.date_to_sql(row['values'][9]['formattedValue'])
    ogPerson1 = mu.sql_escape(row['values'][10]['formattedValue'])
    ogPerson2 = mu.sql_escape(row['values'][11]['formattedValue'])
    link = mu.sql_escape(row['values'][12]['hyperlink'])
    money = row['values'][13]['formattedValue']
    money = int(re.sub('[$,]', '', money)) if money != '-' else 1800

    sql_statements.append(f'INSERT INTO "2tcc_extra_info" VALUES ({tower1}, {tower2}, {upgrade1}, {upgrade2}, {version}, {date}, {money});')
    sql_statements.append(f'INSERT INTO "2tcc_completions" VALUES ({tower1}, {tower2}, {ogMap}, {ogPerson1}, {ogPerson2}, {link}, TRUE, NULL);')
    sql_statements.append(f'INSERT INTO "2tcc_filekeys" VALUES ({tower1}, {tower2}, {ogMap}, {mu.sql_escape(str(uuid.uuid4()))});')

    for altMapNote in altMapNotes.split('\n') if altMapNotes else []:
        match = re.match(ALT_MAPS_REGEX, altMapNote)
        altMap = mu.sql_escape(abbrevToFullName[match.group("map")])
        sql_statements.append(f'INSERT INTO "2tcc_completions" VALUES ({tower1}, {tower2}, {altMap}, {mu.sql_escape(match.group("person1"))}, {mu.sql_escape(match.group("person2"))}, {mu.sql_escape(match.group("link"))}, FALSE, NULL);')
        sql_statements.append(f'INSERT INTO "2tcc_filekeys" VALUES ({tower1}, {tower2}, {altMap}, {mu.sql_escape(str(uuid.uuid4()))});')

with open('2tcc-migrate.sql', 'wb') as f:
    f.write('\n'.join(sql_statements).encode())
    
#with open('out.json', 'w') as f:
#    json.dump(res, f, indent='\t')
