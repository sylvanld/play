import sys
import json
import subprocess
from os import path as os_path, listdir, getcwd, chdir


def abort(message):
    print('[error]\t%s'%message)
    sys.exit(0)


def sanitize(string):
    string = string.lower()
    for sub, repl in [('_', '-')]:
        string = string.replace(sub, repl)
    string = string.strip('/')
    return '-'.join(string.split())


def find_root(path='.'):
    path = os_path.abspath(path)
    filename = os_path.join(path, 'package.json')

    if 'package.json' in listdir(path) and json.load(open(filename)).get('language') == 'python':
        return path
    else:
        new_path = os_path.abspath(os_path.join(path, '..'))
        if new_path == path:
            abort('Not in a python project!')
        else:
            return find_root(new_path)


def current_branch():
    output = subprocess.check_output('git branch', shell=True)
    matches = filter(lambda s: s.startswith('*'), output.decode('utf-8').strip().split('\n'))
    branch = tuple(matches)[0][2:]
    return branch
