import re

def sql_escape(s: str):
    return "'" + s.replace("'", "''") + "'"

def date_to_sql(d: str):
    match = re.match(r'(\d+)/(\d+)/(\d+)', d);
    return sql_escape(f'{int(match.group(3)) + 2000:04d}-{int(match.group(1)):02d}-{int(match.group(2)):02d}')

def standardize_entity(s: str):
    return ' '.join(token.capitalize() for token in re.split(r'\s+', s))
