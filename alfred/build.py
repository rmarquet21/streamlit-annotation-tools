import os
import alfred

@alfred.command("build", help="Builds the project")
def build():
    npm = alfred.sh("npm")
    poetry = alfred.sh("poetry")
    root = alfred.project_directory()

    os.chdir(os.path.join(root, "src", "st_text_annotator", "frontend"))
    alfred.run(npm, ["run", "build"])

    os.chdir(os.path.join(root, ))
    alfred.run(poetry, ["build"])