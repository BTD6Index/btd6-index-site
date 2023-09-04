from googleapiclient.discovery import build
import glob
from google.oauth2 import service_account
import json
import migrationutils as mu

SPREADSHEET_ID = '16of-RFUD1FteVchU9S4vAht39nlh1iraeoNA4u3R9cw'

creds_file = glob.glob('google_service_creds/*.json')[0]
creds = service_account.Credentials.from_service_account_file(creds_file)
service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()

res = sheet.get(
    spreadsheetId = SPREADSHEET_ID,
    ranges = ['Maps!B12:K33', 'Maps!B38:K58', 'Maps!B63:K77', 'Maps!B82:K93'],
    fields = 'sheets/data/rowData/values/note,sheets/data/rowData/values/hyperlink,sheets/data/rowData/values/formattedValue'
    ).execute()['sheets'][0]['data']

yaml_res = {}

with open('maps-data-migrate.sql', 'wb') as f:
    for idx, difficulty in enumerate(['beginner', 'intermediate', 'advanced', 'expert']):
        for row in res[idx]['rowData']:
            entrances_exits = [int(v.strip()) for v in row['values'][9]['formattedValue'].split('/')]

            f.write(f'''
INSERT INTO map_information
VALUES (
    {mu.sql_escape(mu.standardize_entity(row['values'][0]['formattedValue']))},
    {mu.sql_escape(row['values'][2]['formattedValue'])},
    {mu.sql_escape(difficulty)},
    {'TRUE' if '✔️' in row['values'][8]['formattedValue'] else 'FALSE'},
    {'TRUE' if '✔️' in row['values'][7]['formattedValue'] else 'FALSE'},
    {float(row['values'][4]['formattedValue'])},
    {mu.sql_escape(row['values'][4].get('note', None))},
    {mu.sql_escape(row['values'][0].get('note', None))},
    {entrances_exits[0]},
    {entrances_exits[1]},
    {int(row['values'][5]['formattedValue'])},
    {mu.sql_escape(row['values'][6]['formattedValue'] if 'N/A' not in row['values'][6]['formattedValue'] else None)},
    {mu.sql_escape(row['values'][6].get('note', None))},
    {mu.sql_escape(row['values'][3]['formattedValue'])}
);
'''.encode())

#with open('out.json', 'w') as f:
#    json.dump(yaml_res, f, indent=2)
