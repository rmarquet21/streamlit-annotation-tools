import streamlit as st
from st_text_annotator import StTextAnnotator

st.markdown("# Text Annotation Tool")
st.markdown("This is a Streamlit component that provides a text annotation tool. With this tool, users can highlight text, add annotations to it, and group annotations under different references.")

# add link to repo and pyPi
st.markdown("## Links")
st.markdown("Github: [https://github.com/rmarquet21/st-text-annotator](https://github.com/rmarquet21/st-text-annotator)")
st.markdown("PyPi: [https://pypi.org/project/st-text-annotator/](https://pypi.org/project/st-text-annotator/)")

# add example
st.markdown("## Example")

text = st.text_input("Enter the text you want to annotate")

if text:
    results = StTextAnnotator(text, [])
    st.write(results)
