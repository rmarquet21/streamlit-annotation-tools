import os
import subprocess
import alfred


def update_version(version, type):
    if type == "patch":
        return ".".join(version.split(".")[:-1]) + "." + str(int(version.split(".")[-1]) + 1)
    elif type == "minor":
        return ".".join(version.split(".")[:-2]) + "." + str(int(version.split(".")[-2]) + 1) + ".0"
    elif type == "major":
        return str(int(version.split(".")[0]) + 1) + ".0.0"
    else:
        raise ValueError(f"unknown version type '{type}'")


@alfred.command("version:update", help="update package version")
@alfred.option("-t", "--type", default="patch")
def version_update(type):
    version = subprocess.run(["poetry", "version", "-s", "-n"], capture_output=True, text=True).stdout.strip()
    print(f"current version: {version}")

    poetry = alfred.sh("poetry")
    npm = alfred.sh("npm")

    alfred.run(poetry, ["version", update_version(version, type)])

    directory = alfred.project_directory()
    os.chdir(os.path.join(directory, "src", "streamlit_annotation_tools", "frontend"))
    alfred.run(npm, ["version", update_version(version, type)])

