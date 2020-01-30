import json
import subprocess


version_types = ['patch', 'minor', 'major']


def current_branch():
    output = subprocess.check_output('git branch', shell=True)
    matches = filter(lambda s: s.startswith('*'), output.decode('utf-8').strip().split('\n'))
    branch = tuple(matches)[0][2:]
    return branch
   

def cinput(*messages, required=False, choices=None):
    """
    custom input
    """
    messages = list(messages)
    if choices is not None:
        messages.append(', '.join(map(
            lambda choice: '[%s] %s' % (choices.index(choice), choice + ' (default)'*(choices.index(choice)==0)), choices)),)
    messages[-1] += ": "

    response = ""
    while response == "":
        response = input('\n'.join(messages))
        if choices:
            try:
                response = int(response)
                if response < 0 or response >= len(choices):
                    print('bad interval')
                    raise ValueError
            except ValueError:
                response = ""
                print('please select from interval [%s, %s]'%(0, len(choices)-1))
    print('-'*60)
    return response


def increment_version(type_index=0):
    # increment (in-memory) current version
    package_data = json.load(open('package.json'))
    version = [int(x) for x in package_data['version'].split('.')]

    version = [version[i]*(i+type_index<=2) + 1*(2==i+type_index) for i in range(3)]
    version = '.'.join([str(x) for x in version])

    # save version note and commit
    package_data['version'] = version
    json.dump(package_data, open('package.json', 'w'))
    return version


def deploy(type_index):
    version_note = cinput("Note for version")
    commit_message = version_types[type_index].upper() + ': ' + version_note

    old_branch = current_branch()

    subprocess.call('git checkout dev', shell=True)
    version = increment_version(type_index)

    for command in [
        'git add .',
        'git commit -m "%s"'%commit_message,
        'git push origin dev',
        'git checkout master',
        'git pull origin dev',
        'git push origin master',
        'git tag %s'%version,
        'git push --tags',
        'git checkout %s'%old_branch
    ]:
        subprocess.check_call(command, shell=True)

if __name__ == '__main__':
    deploy()
