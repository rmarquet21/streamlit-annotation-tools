import os
import random

import streamlit.components.v1 as components

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = False

# Declare a Streamlit component. `declare_component` returns a function
# that is used to create instances of the component. We're naming this
# function "_component_func", with an underscore prefix, because we don't want
# to expose it directly to users. Instead, we will create a custom wrapper
# function, below, that will serve as our component's public API.

# It's worth noting that this call to `declare_component` is the
# *only thing* you need to do to create the binding between Streamlit and
# your component frontend. Everything else we do in this file is simply a
# best practice.

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("StAnnotation"
        # does not fit this bill, so please choose something better for your
        # own component :)
        "StAnnotation",
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to the component's
    # build directory:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component_func = components.declare_component("StAnnotation", path=build_dir)


# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def StAnnotation(text, annotations):
    """Create a new instance of "StAnnotation".

    Parameters
    ----------
    text : str

    annotations : list
    Returns
    -------
    dict
        The value returned by the component.

    """
    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    component_value = _component_func(text=text, annotations=annotations)

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value


# Add some test code to play with the component while it's in development.
# During development, we can run this just as we would any other Streamlit
# app: `$ streamlit run st_annotation/__init__.py`
if not _RELEASE:
    import streamlit as st

    if "texts" not in st.session_state:
        st.session_state["texts"] = [
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin volutpat lorem arcu, in tempor felis eleifend non. Nam eleifend vitae ante ut pharetra.",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin volutpat lorem arcu."
        ]
        
    if "text_selected" not in st.session_state:
        st.session_state['text_selected'] = random.choice(st.session_state['texts'])

    if "responses" not in st.session_state:
        st.session_state['responses'] = []

    if len(st.session_state['texts']) == 0:
        st.write("All texts have been annotated!")
    else:
        if st.sidebar.button("Finished"):
            if len(st.session_state['texts']) > 1:
                st.session_state['texts'].remove(st.session_state['text_selected'])
                st.session_state['text_selected'] = random.choice(st.session_state['texts'])

        st.session_state['responses'] = StAnnotation(
            text=st.session_state['text_selected'],
            annotations=[]
        )

    print(st.session_state['responses'])
