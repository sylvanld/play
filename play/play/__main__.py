import argparse, sys
from .common import find_root, getcwd, chdir

def parse_args():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    deploy_parser = subparsers.add_parser('deploy')
    deploy_parser.set_defaults(command='deploy')
    deploy_parser.add_argument('--patch', action='store_const', default=0, const=0)
    deploy_parser.add_argument('--minor', action='store_const', default=0, const=1)
    deploy_parser.add_argument('--major', action='store_const', default=0, const=2)

    feature_parser = subparsers.add_parser('feature')
    feature_parser.set_defaults(command='feature')
    feature_parser.add_argument('action', choices=['create', 'close'])
    
    args = parser.parse_args()
    if not getattr(args, 'command', None):
        parser.print_help()
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

    chdir(origin)

if __name__ == '__main__':
    main()