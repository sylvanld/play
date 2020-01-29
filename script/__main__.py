import argparse, sys

def parse_args():
    parser = argparse.ArgumentParser()
    subparsers = parser.add_subparsers()

    deploy_parser = subparsers.add_parser('deploy')
    deploy_parser.set_defaults(command='deploy')
    deploy_parser.add_argument('version_note', nargs='*', type=str)
    deploy_parser.add_argument('--patch', action='store_const', default=0, const=0)
    deploy_parser.add_argument('--minor', action='store_const', default=0, const=1)
    deploy_parser.add_argument('--major', action='store_const', default=0, const=2)

    args = parser.parse_args()
    if not getattr(args, 'command', None):
        parser.print_help()
        sys.exit(2)
    
    return args

def main():
    args = parse_args()
    print(args)

    if args.command == 'deploy':
        from .deploy import deploy
        version_index = args.major or args.minor or args.patch
        deploy(version_index, version_note=" ".join(args.version_note))

if __name__ == '__main__':
    main()