import argparse, sys
from .common import find_root, getcwd, chdir


def add_deploy_parser(subparsers):
    deploy_parser = subparsers.add_parser('deploy')
    deploy_parser.set_defaults(command='deploy')
    deploy_parser.add_argument('--patch', action='store_const', default=0, const=0)
    deploy_parser.add_argument('--minor', action='store_const', default=0, const=1)
    deploy_parser.add_argument('--major', action='store_const', default=0, const=2)


def add_feature_parser(subparsers):
    def add_create_feature_parser(subparsers):
        create_feature_parser = subparsers.add_parser('create')
        create_feature_parser.set_defaults(action='create')
        create_feature_parser.add_argument('name')

    def add_merge_feature_parser(subparsers):
        merge_feature_parser = subparsers.add_parser('merge')
        merge_feature_parser.set_defaults(action='merge')

    feature_parser = subparsers.add_parser('feature')
    feature_subparsers = feature_parser.add_subparsers()
    feature_parser.set_defaults(command='feature')

    add_create_feature_parser(feature_subparsers)
    add_merge_feature_parser(feature_subparsers)

    return feature_parser


def parse_args():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    add_deploy_parser(subparsers)
    feature_parser = add_feature_parser(subparsers)
    
    args = parser.parse_args()
    if not getattr(args, 'command', None):
        parser.print_help()
        sys.exit(2)
    elif args.command == 'feature':
        if not getattr(args, 'action', None):
            feature_parser.print_help()
            sys.exit(2)

    return args

def main():
    args = parse_args()

    origin = getcwd()
    root = find_root()
    chdir(root)

    if args.command == 'deploy':
        from .deploy import deploy

        version_index = args.major or args.minor or args.patch
        deploy(version_index)
    elif args.command == 'feature':
        from .features import create_feature, merge_current_feature

        if args.action == 'create':
            create_feature(args.name)
        elif args.action == 'merge':
            merge_current_feature()

    chdir(origin)

if __name__ == '__main__':
    main()