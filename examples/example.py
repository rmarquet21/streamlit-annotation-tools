import streamlit as st
from streamlit_annotation_tools import text_highlighter, text_labeler


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


pages = {"Labeler tool": labeler_page, "Highlighter tool": highlighter_page}

demo_name = st.sidebar.selectbox("Choose a demo", pages.keys())
pages[demo_name]()
