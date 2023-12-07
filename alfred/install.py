import os
import alfred


@alfred.command("install:component", help="install component")
def install_component():
    npm = alfred.sh("npm")

    root = alfred.project_directory()
    os.chdir(os.path.join(root, "src", "st_text_annotator", "frontend"))
    alfred.run(npm, ["install"])
