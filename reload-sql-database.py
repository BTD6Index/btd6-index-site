import argparse
import subprocess
import shutil

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Runs all migration sql scripts.')
    parser.add_argument('--local', action='store_true')
    args = parser.parse_args()
    for sql_file in ['destroy-tables.sql', 'init-tables.sql', '2mp-migrate.sql', '2tc-migrate.sql']:
        subprocess.run([
            shutil.which('npx'), 'wrangler', 'd1', 'execute', 'btd6index', '--file', sql_file
            ] + (['--local'] if args.local else []), check=True)
