import json
import re
import argparse

parser = argparse.ArgumentParser(description='Migrate 2tcs from a Cyber Quincy dump to SQL for the index website.')
parser.add_argument('--input_file', default='../cyberquincy/cache/index/2tc.json')
parser.add_argument('--output_file', default='2tc-migrate.sql')
args = parser.parse_args()

def sql_escape(s: str):
    return "'" + s.replace("'", "''") + "'"

def date_to_sql(d: str):
    match = re.match(r'(\d+)/(\d+)/(\d+)', d);
    return sql_escape(f'{int(match.group(3)) + 2000:04d}-{int(match.group(1)):02d}-{int(match.group(2)):02d}')

EXTRACT_LINK_REGEX = re.compile(r"\(([^\)]*)\)")

with open(args.input_file, 'rb') as f:
    parsed = json.load(f)

with open(args.output_file, 'wb') as f:
    for entry in parsed['info']:
        f.write(f'INSERT INTO "2tc_extra_info" VALUES ({sql_escape(entry["TOWER_1"]["NAME"])}, {sql_escape(entry["TOWER_2"]["NAME"])}, {sql_escape(entry["TOWER_1"]["UPGRADE"])}, {sql_escape(entry["TOWER_2"]["UPGRADE"])}, {sql_escape(entry["VERSION"])}, {date_to_sql(entry["DATE"])}, FALSE);\n'
                .encode())
        for key, sub_entry in entry['MAPS'].items():
            link_match = EXTRACT_LINK_REGEX.search(sub_entry['LINK'])
            link = link_match.group(1) if link_match else link
            f.write(
                f'INSERT INTO "2tc_completions" VALUES ({sql_escape(entry["TOWER_1"]["NAME"])}, {sql_escape(entry["TOWER_2"]["NAME"])}, {sql_escape(key)}, {sql_escape(sub_entry["PERSON"])}, {sql_escape(link)}, {int(sub_entry.get("OG", False))}, FALSE);\n'
                .encode()
                )
