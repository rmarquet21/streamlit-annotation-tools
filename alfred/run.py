import os
import alfred


@alfred.command("run:streamlit", help="run development server")
def run_streamlit():
    os.environ["ST_TEXT_ANNOTATOR_RELEASE"] = "false"
    
    python = alfred.sh("python")
    
    root = alfred.project_directory()
    os.chdir(os.path.join(root, "src", "st_text_annotator"))
    alfred.run(python, ["-m", "streamlit", "run", "__init__.py"])

@alfred.command("run:component", help="run development server")
def run_component():
    npm = alfred.sh("npm")
    
    root = alfred.project_directory()
    os.chdir(os.path.join(root, "src", "st_text_annotator", "frontend"))
    alfred.run(npm, ["start"])