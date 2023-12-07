import os
import alfred


@alfred.command("install:component", help="install component")
def install_component():
    npm = alfred.sh("npm")

    root = alfred.project_directory()
    os.chdir(os.path.join(root, "src", "streamlit_annotation_tools", "frontend"))
    alfred.run(npm, ["install"])
