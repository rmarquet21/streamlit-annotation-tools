import os

import streamlit.components.v1 as components

RELEASE = os.environ.get("STREAMLIT_ANNOTATION_TOOLS_RELEASE", "true") == "true"

if not RELEASE:
    _component = components.declare_component(
        "annotation_tools", url="http://localhost:3001"
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _component = components.declare_component("annotation_tools", path=build_dir)


def text_highlighter(text: str, highlights=[]):
    """Create a new instance of "text_highlighter".

    Parameters
    ----------
    text : str
        The text to be annotated

    highlights: list
        If the text has already been annotated, the highlights can be passed to the component in the form of a list of dictionaries with the following structure:
        [
            [
                {
                    label: "label",
                    start: 0,
                    end: 10
                },
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ],
            [
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ]
        ]

    Returns
    -------
    list or None
        The highlights made by the user in the form of a list of dictionaries with the following structure:
        [
            [
                {
                    label: "label",
                    start: 0,
                    end: 10
                },
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ],
            [
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ]
        ]
    """

    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    component_value = _component(
        text=text, highlights=highlights, mode="text_highlighter"
    )

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value


def text_labeler(text: str, labels=[], in_snake_case=False):
    """Create a new instance of "text_labeler".

    Parameters
    ----------
    text : str
        The text to be labeled

    labels : list
        If the text has already been labeled, the labels can be passed to the component in the form of a list of dictionaries with the following structure:
        {
            "label1": [
                {
                    label: "label",
                    start: 0,
                    end: 10
                },
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ],
        }

    in_snake_case : bool
        If True, the labels will be converted to snake case before being returned.

    Returns
    -------
    list or None
        The labels made by the user in the form of a list of dictionaries with the following structure:
        {
            "label1": [
                {
                    label: "label",
                    start: 0,
                    end: 10
                },
                {
                    label: "label",
                    start: 0,
                    end: 10
                }
            ],
        }
    """

    # Call through to our private component function. Arguments we pass here
    # will be sent to the frontend, where they'll be available in an "args"
    # dictionary.
    #
    # "default" is a special argument that specifies the initial return
    # value of the component before the user has interacted with it.
    component_value = _component(
        text=text, labels=labels, in_snake_case=in_snake_case, mode="text_labeler"
    )

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value


if __name__ == "__main__":
    # This is an example of how to use the component in a Streamlit app.
    # It's not required for the component to work.
    import streamlit as st

    def highlighter_page():
        st.title("Text Annotation Tool")

        text = "Lorem ipsum dolor sit et amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."

        highlights = [
            [
                {"start": 0, "end": 5, "label": "Lorem"},
                {"start": 12, "end": 17, "label": "dolor"},
            ],
            [
                {"start": 6, "end": 11, "label": "ipsum"},
                {"start": 18, "end": 21, "label": "sit"},
            ],
        ]

        highlights = text_highlighter(text, highlights)

        st.write("Annotations:")
        st.write(highlights)

    def labeler_page():
        st.title("Text Labeling Tool")

        text = "Yesterday, at 3 PM, Emily Johnson and Michael Smith met at the Central Park in New York to discuss the merger between TechCorp and Global Solutions. The deal, worth approximately 500 million dollars, is expected to significantly impact the tech industry. Later, at 6 PM, they joined a conference call with the CEO of TechCorp, David Brown, who was in London for a technology summit. During the call, they discussed the market trends in Asia and Europe and planned for the next quarterly meeting, which is scheduled for January 15th, 2024, in Paris."

        labels = {
            "Personal names": [
                {"start": 20, "end": 33, "label": "Emily Johnson"},
                {"start": 38, "end": 51, "label": "Michael Smith"},
                {"start": 327, "end": 338, "label": "David Brown"},
            ],
            "Organizations": [
                {"start": 118, "end": 126, "label": "TechCorp"},
                {"start": 131, "end": 147, "label": "Global Solutions"},
            ],
            "Locations": [
                {"start": 63, "end": 75, "label": "Central Park"},
                {"start": 79, "end": 87, "label": "New York"},
                {"start": 351, "end": 357, "label": "London"},
                {"start": 436, "end": 440, "label": "Asia"},
                {"start": 445, "end": 451, "label": "Europe"},
                {"start": 542, "end": 547, "label": "Paris"},
            ],
            "Time": [
                {"start": 0, "end": 9, "label": "Yesterday"},
                {"start": 14, "end": 18, "label": "3 PM"},
                {"start": 265, "end": 269, "label": "6 PM"},
                {"start": 519, "end": 531, "label": "January 15th"},
                {"start": 533, "end": 537, "label": "2024"},
            ],
            "Money": [{"start": 179, "end": 198, "label": "500 million dollars"}],
        }

        labels = text_labeler(text, labels, in_snake_case=False)

        st.write("Labels:")
        st.write(labels)

    pages = {"Highlighter tool": highlighter_page, "Labeler tool": labeler_page}

    demo_name = st.sidebar.selectbox("Choose a demo", pages.keys())
    pages[demo_name]()
