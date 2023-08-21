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
    ranges = ['FTTC!B12:J65', 'FTTC!B70:K80'],
    fields = 'sheets/data/rowData/values/note,sheets/data/rowData/values/hyperlink,sheets/data/rowData/values/formattedValue'
    ).execute()['sheets'][0]['data']

with open('fttc-migrate.sql', 'wb') as f:
    for row in res[0]['rowData']:
        vals = row['values']
        ogMap = mu.standardize_entity(vals[0]['formattedValue'])
        altStuff = vals[0].get('notes', None)
        towerset = mu.standardize_entity(json.dumps([vals[2]['formattedValue']]))
        version = mu.standardize_entity(vals[3]['formattedValue'])
        date = mu.date_to_sql(vals[4]['formattedValue'])
        person = mu.standardize_entity(vals[5]['formattedValue'])
        link = mu.standardize_entity(vals[7]['hyperlink'])

#with open('out.json', 'w') as f:
#    json.dump(res, f, indent='\t')
