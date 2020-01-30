import sys
import subprocess
from .common import current_branch, abort, sanitize

def create_feature(name):
    feature_name = 'feature/' + sanitize('name')
    commands = (
        ['git', 'checkout', 'dev'],
        ['git', 'pull'],
        ['git', 'checkout', '-b', feature_name],
        ['git', 'push', '-u', 'origin', feature_name]
    )
    for command in commands:
        subprocess.call(command, shell=True)

def merge_current_feature():
    feature_branch = current_branch()

    if not feature_branch.startswith('feature/'):
        abort('you can only close a feature branch')
    
    commands = (
        ['git', 'add', '.'],
        ['git', 'commit', '-m', '"work done for branch %s"'%feature_branch],
        ['git', 'push', 'origin', feature_branch],
        ['git', 'checkout', 'dev'],
        ['git', 'pull']
        ['git', 'merge', feature_branch]
        ['git', 'push']
    )

    for command in commands:
        subprocess.call(command, shell=True)
    