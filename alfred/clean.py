import alfred


@alfred.command('clean', help='Remove temporary files')
def clean():
    rm = alfred.sh('rm')

    alfred.run(rm, ['-rf', 'build', 'dist', '*.egg-info', 'src/streamlit_annotation_tools/frontend/build'])