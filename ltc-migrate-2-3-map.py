from googleapiclient.discovery import build
import glob
from google.oauth2 import service_account
import migrationutils as mu
import json
import uuid
import re

SPREADSHEET_ID = '16of-RFUD1FteVchU9S4vAht39nlh1iraeoNA4u3R9cw'

CHEAPEST_COMPLETION_RE = r'^\s*Cheapest:\s*(?P<player>[^,]*?)\s*,\s*(?P<link>[^\s]*)'

creds_file = glob.glob('google_service_creds/*.json')[0]
creds = service_account.Credentials.from_service_account_file(creds_file)
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()
res = sheet.get(
    spreadsheetId = SPREADSHEET_ID,
    ranges = ['LTC!B13:M14', 'LTC!B19:O68', 'LTC!B73:Q83', 'LTC!B88:T91', 'LTC!B100:X102'],
    fields = 'sheets/data/rowData/values/note,sheets/data/rowData/values/hyperlink,sheets/data/rowData/values/formattedValue'
    ).execute()['sheets'][0]['data']

with open('out.json', 'w') as f:
    json.dump(res, f, indent='\t')

def writeSql(file, row, numTowers):
    vals = row['values']
    map = mu.sql_escape(mu.standardize_entity(vals[0]['formattedValue']))
    altStuff = vals[0].get('note', '')
    towerset = mu.sql_escape(
        json.dumps([
            mu.standardize_entity(vals[2 + 2*i]['formattedValue'])
            for i in range(numTowers)
            ])
    )
    upgradeset = mu.sql_escape(
        json.dumps([s.strip() for s in vals[2 + 2*numTowers]['formattedValue'].split('|')])
    )
    upgradesetsz = 3 if numTowers >= 4 else 2
    version = mu.sql_escape(vals[2 + upgradesetsz + 2*numTowers]['formattedValue'])
    date = mu.date_to_sql(vals[3 + upgradesetsz + 2*numTowers]['formattedValue'])
    person = mu.sql_escape(vals[4 + upgradesetsz + 2*numTowers]['formattedValue'])
    link = vals[6 + upgradesetsz + 2*numTowers].get('hyperlink', None)
    link = mu.sql_escape(link) if link else 'NULL'
    file.write(f'''INSERT INTO "ltc_completions" VALUES (
    {map}, {towerset}, {person}, {link}, \'og\', NULL, {upgradeset}, {version}, {date}, NULL, {mu.sql_escape(str(uuid.uuid4()))});
'''.encode())
    cheapestMatch = re.match(CHEAPEST_COMPLETION_RE, altStuff)
    if cheapestMatch:
        altPerson = mu.sql_escape(cheapestMatch.group('player'))
        altLink = mu.sql_escape(cheapestMatch.group('link'))
        file.write(f'''INSERT INTO "ltc_completions" VALUES (
    {map}, {towerset}, {altPerson}, {altLink}, \'cheapest\', NULL, NULL, NULL, NULL, NULL, {mu.sql_escape(str(uuid.uuid4()))});
'''.encode())


with open('ltc-migrate.sql', 'wb') as f:
    for row in res[0]['rowData']:
        writeSql(f, row, 1)
    for row in res[1]['rowData']:
        writeSql(f, row, 2)
    for row in res[2]['rowData']:
        writeSql(f, row, 3)
    for row in res[3]['rowData']:
        writeSql(f, row, 4)
    for row in res[4]['rowData']:
        writeSql(f, row, 6)

