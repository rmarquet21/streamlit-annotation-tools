import alfred

@alfred.command("deploy", help="Deploy the project")
@alfred.option("--dry-run", "-d", is_flag=True, help="Dry run")
def deploy(dry_run):
    poetry = alfred.sh("poetry")
    args = ["publish"]

    if dry_run:
        args.append("--dry-run")

    alfred.invoke_command("build")
    alfred.run(poetry, args)