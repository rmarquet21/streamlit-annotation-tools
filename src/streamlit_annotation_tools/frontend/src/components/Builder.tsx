import React from "react";
import Highlighter from "./Highlighter";
import Labeler from "./Labeler";

const Builder: React.FC<{mode: string}> = ({ mode }) => {

    if (mode === "text_highlighter") {
        return <Highlighter />;
    } else if (mode === "text_labeler") {
        return <Labeler />;
    } else {
        return null;
    }
}

export default Builder;
