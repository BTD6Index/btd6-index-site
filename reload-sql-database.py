import argparse
import subprocess
import shutil
import sys

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Runs all migration sql scripts.')
    parser.add_argument('--local', action='store_true')
    parser.add_argument('--skip-prompt', action='store_true')
    args = parser.parse_args()
    if not args.skip_prompt:
        if input(f'This will run all migration scripts in the {"local" if args.local else "global"} database. Proceed (y)?') != 'y':
            sys.exit(0)
    for sql_file in ['destroy-tables.sql', 'init-tables.sql', '2mp-migrate.sql', '2tc-migrate.sql']:
        subprocess.run([
            shutil.which('npx'), 'wrangler', 'd1', 'execute', 'btd6index', '--file', sql_file
            ] + (['--local'] if args.local else []), check=True)
