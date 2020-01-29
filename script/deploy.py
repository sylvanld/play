import json
import subprocess

def current_branch():
    output = subprocess.check_output('git branch', shell=True)
    matches = filter(lambda s: s.startswith('*'), output.decode('utf-8').strip().split('\n'))
    branch = tuple(matches)[0][2:]
    return branch
    """
    [
        current_branch,
        'git checkout dev',
        'increment version',
        'git add .',
        'git commit -m TRUC: version note',
        'git push origin dev',
        'git checkout master',
        'git pull origin dev',
        'git tag VERSION'
        'git push --tags' <-- deployed
    ]
    """

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

def increment_version():
    version_types = ['patch', 'minor', 'major']
    type_index = cinput('Select version type', choices=version_types)

    # increment (in-memory) current version
    package_data = json.load(open('package.json'))
    version = [int(x) for x in package_data['version'].split('.')]

    version = [version[i]*(i+type_index<=2) + 1*(2==i+type_index) for i in range(3)]
    version = '.'.join([str(x) for x in version])

    # ask message
    version_note = cinput("Note for version (%s)"%version)
    commit_message = version_types[type_index].upper() + ': ' + version_note

    # save version note and commit
    package_data['version'] = version
    json.dump(package_data, open('package.json', 'w'))


old_branch = current_branch()

subprocess.call('git checkout dev', shell=True)

print(old_branch, current_branch())