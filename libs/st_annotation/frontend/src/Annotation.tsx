import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface Reference {
  start: number,
  end: number,
  label: string
}

interface State {
  text: string
  actual_text: JSX.Element[]
  selectedReference: number
  annotations: Reference[][]
}

const COLOR = "#fbf8cc"


class Annotation extends StreamlitComponentBase<State> {
  public state: State = { text: "", actual_text: [], annotations: [], selectedReference: 0 }

  public async componentDidMount() {
    const { text, annotations } = this.props.args

    await this.setState({ text, annotations })

    let actual_text = [<>{ text }</>]

    if (annotations.length > 0) {
      actual_text = this.renderHighlightedText()
    }
    this.setState({ actual_text })
    Streamlit.setComponentValue({ annotations: annotations })
  }

  private checkOverlap = (start: number, end: number, annotations: Reference[]) => {
    return annotations.some((annotation) => {
      return (annotation.start < start && annotation.end > start) || (annotation.start < end && annotation.end > end)
    })
  }

  private handleMouseUp = () => {
    const selection = document.getSelection()

    if (selection && selection.toString().length > 0) {
      const { annotations } = this.state

      const start = selection.anchorOffset < selection.focusOffset ? selection.anchorOffset : selection.focusOffset
      const end = selection.anchorOffset < selection.focusOffset ? selection.focusOffset : selection.anchorOffset

      const selected_text = this.state.text.slice(start, end)

      if (annotations.length < this.state.selectedReference + 1) {
        annotations.push([])
      }

      if (
        this.checkOverlap(start, end, annotations[this.state.selectedReference]) && annotations[this.state.selectedReference].length === 1
      ) {
        annotations.splice(this.state.selectedReference, 1)
      }
      // if overlap with other annotation remove the smaller one
      else if (this.checkOverlap(start, end, annotations[this.state.selectedReference])) {
        annotations[this.state.selectedReference] = annotations[this.state.selectedReference].filter((annotation) => {
          return !((annotation.start < start && annotation.end > start) || (annotation.start < end && annotation.end > end))
        })
      } else {
        annotations[this.state.selectedReference].push({
          start,
          end,
          label: selected_text,
        })
      }

      Streamlit.setComponentValue({ annotations: annotations })
    }
    this.setState({ actual_text: this.renderHighlightedText() })
  }

  private handleMouseDown = () => {
    this.setState({ actual_text: [<>{ this.state.text }</>] })
  }

  private newReference = () => {
    this.setState({ selectedReference: this.state.annotations.length })
  }

  private renderHighlightedText = () => {
    const { annotations, text: total_text } = this.state

    const selectedAnnotations = annotations.map((listAnnotation, index) => {
      return listAnnotation.map((annotation) => {
        return {
          ...annotation,
          index,
          color: COLOR,
          text: total_text.slice(annotation.start, annotation.end),
        }
      })
    }).filter((annotation, index) => index === this.state.selectedReference)

    // flatten array
    const flattenAnnotations = selectedAnnotations.flat()

    // sort by start
    const sortedAnnotations = flattenAnnotations.sort((a, b) => a.start - b.start)

    // render text with color
    let lastEnd = 0

    if (sortedAnnotations.length === 0) {
      return [<>{ total_text }</>]
    }

    return sortedAnnotations.map((annotation, index_annotations, array) => {
      const { start, end, color, text, index } = annotation
      const textBefore = total_text.slice(lastEnd, start)
      lastEnd = end

      return (
        <>
          { textBefore }
          <span style={ {
            backgroundColor: this.state.selectedReference === index ? color : "transparent",
            color: this.state.selectedReference === index ? "black" : "white",
          } }>{ text }</span>
          { index_annotations === array.length - 1 && total_text.slice(end) }
        </>
      )
    })
  }

  public render = (): ReactNode => {
    return (
      <>
        <div>
          <button
            onClick={ this.newReference }
            style={ { backgroundColor: "transparent", color: "white", border: "1px solid white" } }
          >
            New Reference
          </button>
          <div style={ { display: "flex", flexDirection: "column", flexWrap: "wrap" } }>
            { // get selected reference
              this.state.annotations.map((annotation, index) => {
                return (
                  <div
                    key={ index }
                    style={ { textAlign: "start" } }
                  >
                    <button
                      onClick={ async () => {
                        await this.setState({ selectedReference: index })
                        this.setState({ actual_text: this.renderHighlightedText() })
                      } }
                      style={ {
                        backgroundColor: this.state.selectedReference !== index ? "transparent" : COLOR,
                        color: this.state.selectedReference !== index ? "white" : "black",
                        fontWeight: this.state.selectedReference === index ? "bold" : "normal",
                        border: this.state.selectedReference === index ? "1px solid white" : "1px solid transparent",
                        width: "400px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textAlign: "start",
                      } }>
                      { annotation[0].label}
                    </button>
                    <button
                      onClick={ async () => {
                        await this.setState({
                          annotations: this.state.annotations.filter((_, i) => i !== index),
                          selectedReference: this.state.selectedReference === index ? 0 : this.state.selectedReference,
                        })
                        this.setState({ actual_text: this.renderHighlightedText() })
                        Streamlit.setComponentValue({ annotations: this.state.annotations.filter((_, i) => i !== index) })
                      } }
                      style={ {
                        backgroundColor: this.state.selectedReference !== index ? "transparent" : COLOR,
                        color: this.state.selectedReference !== index ? "white" : "black",
                        fontWeight: this.state.selectedReference === index ? "bold" : "normal",
                        border: this.state.selectedReference === index ? "1px solid white" : "1px solid transparent",
                      } }>
                      X
                    </button>
                  </div>
                )
              })
            }
          </div>
        </div>
        <br/>
        <br/>
        <div>
          <div
            id="text" style={ { whiteSpace: "pre-wrap" } }
            onMouseUp={ this.handleMouseUp }
            onMouseDown={ this.handleMouseDown }
          >
            { this.state.actual_text }
          </div>
        </div>
      </>
    )
  }
}

export default withStreamlitConnection(Annotation)
