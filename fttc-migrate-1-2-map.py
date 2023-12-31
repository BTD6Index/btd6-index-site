from googleapiclient.discovery import build
import glob
from google.oauth2 import service_account
import migrationutils as mu
import json
import uuid

SPREADSHEET_ID = '16of-RFUD1FteVchU9S4vAht39nlh1iraeoNA4u3R9cw'

creds_file = glob.glob('google_service_creds/*.json')[0]
creds = service_account.Credentials.from_service_account_file(creds_file)
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()
res = sheet.get(
    spreadsheetId = SPREADSHEET_ID,
    ranges = ['FTTC!B12:J65', 'FTTC!B70:K81'],
    fields = 'sheets/data/rowData/values/note,sheets/data/rowData/values/hyperlink,sheets/data/rowData/values/formattedValue'
    ).execute()['sheets'][0]['data']

def wizToWizard(s: str):
    if s == 'Wiz':
        return 'Wizard'
    return s

def write_query(file, *, map, altStuff, towerset, version, date, person, link):
    file.write(f'INSERT INTO "fttc_extra_info" VALUES ({map}, {version}, {date});\n'.encode())
    file.write(f'INSERT INTO "fttc_completions" VALUES ({map}, {towerset}, {person}, {link}, TRUE, NULL);\n'.encode())
    file.write(f'INSERT INTO "fttc_filekeys" VALUES ({map}, {towerset}, {mu.sql_escape(str(uuid.uuid4()))});\n'.encode())
    for altRow in (altStuff.split('\n') if altStuff else []):
        altTowerset, altPerson, altLink = (s.strip() for s in altRow.split('|'))
        altTowerset = mu.sql_escape(
            json.dumps([wizToWizard(s.strip()) for s in altTowerset.split(',')])
            )
        altPerson = mu.sql_escape(altPerson)
        altLink = mu.sql_escape(altLink)
        file.write(f'INSERT INTO "fttc_completions" VALUES ({map}, {altTowerset}, {altPerson}, {altLink}, FALSE, NULL);\n'.encode())
        file.write(f'INSERT INTO "fttc_filekeys" VALUES ({map}, {altTowerset}, {mu.sql_escape(str(uuid.uuid4()))});\n'.encode())

with open('fttc-migrate.sql', 'wb') as f:
    for row in res[0]['rowData']:
        vals = row['values']
        map = mu.sql_escape(mu.standardize_entity(vals[0]['formattedValue']))
        altStuff: str = vals[0].get('note', None)
        towerset = mu.sql_escape(
            json.dumps([
                vals[2]['formattedValue']
                ])
        )
        version = mu.sql_escape(vals[3]['formattedValue'])
        date = mu.date_to_sql(vals[4]['formattedValue'])
        person = mu.sql_escape(vals[5]['formattedValue'])
        link = mu.sql_escape(vals[7]['hyperlink'])
        write_query(f, map=map, altStuff=altStuff, towerset=towerset, version=version, date=date, person=person, link=link)
    for row in res[1]['rowData']:
        vals = row['values']
        map = mu.sql_escape(mu.standardize_entity(vals[0]['formattedValue']))
        altStuff: str = vals[0].get('note', None)
        towerset = mu.sql_escape(
            json.dumps([
                vals[2]['formattedValue'],
                vals[3]['formattedValue']
            ])
        )
        version = mu.sql_escape(vals[4]['formattedValue'])
        date = mu.date_to_sql(vals[5]['formattedValue'])
        person = mu.sql_escape(vals[6]['formattedValue'])
        link = mu.sql_escape(vals[8]['hyperlink'])
        write_query(f, map=map, altStuff=altStuff, towerset=towerset, version=version, date=date, person=person, link=link)



#with open('out.json', 'w') as f:
#    json.dump(res, f, indent='\t')
