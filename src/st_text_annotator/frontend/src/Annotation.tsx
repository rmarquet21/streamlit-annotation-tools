import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React from "react"

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

class Annotation extends StreamlitComponentBase<State> {
  state: State = {
    text: "",
    actual_text: [],
    annotations: [],
    selectedReference: 0
  }

  async componentDidMount(): Promise<void> {
    const { text, annotations } = this.props.args

    await this.setState({ text, annotations })
    await this.setState({ actual_text: this.renderText() })
    Streamlit.setComponentValue(annotations)
  }

  isAnnotated(start: number, end: number): boolean {
    const { annotations, selectedReference } = this.state
    
    if (!annotations[selectedReference]) {
      return false
    }

    for (let i = 0; i < annotations[selectedReference].length; i++) {
      if (
        (start >= annotations[selectedReference][i].start && end <= annotations[selectedReference][i].end) ||
        (start <= annotations[selectedReference][i].start && end >= annotations[selectedReference][i].end) ||
        (start <= annotations[selectedReference][i].start && end > annotations[selectedReference][i].start && end <= annotations[selectedReference][i].end) ||
        (start >= annotations[selectedReference][i].start && start < annotations[selectedReference][i].end && end >= annotations[selectedReference][i].end)
        ) {
        return true
      }
    }
    return false
  }

  removeAnnotation(start: number, end: number): Reference[][] {
    const { annotations, selectedReference } = this.state

    for (let i = 0; i < annotations[selectedReference].length; i++) {
      if (
        (start >= annotations[selectedReference][i].start && end <= annotations[selectedReference][i].end) ||
        (start <= annotations[selectedReference][i].start && end >= annotations[selectedReference][i].end) ||
        (start <= annotations[selectedReference][i].start && end > annotations[selectedReference][i].start && end <= annotations[selectedReference][i].end) ||
        (start >= annotations[selectedReference][i].start && start < annotations[selectedReference][i].end && end >= annotations[selectedReference][i].end)
        ) {
        annotations[selectedReference].splice(i, 1)
        break
      }
    }

    if (annotations[selectedReference].length === 0) {
      annotations.splice(selectedReference, 1)
    }

    return annotations
  }

  getCharactersCountUntilNode = (node: Node, parent: HTMLElement | null) => {
    const walker = document.createTreeWalker(
      parent || document.body,
      NodeFilter.SHOW_TEXT,
      null,
    );
    
    let charCount = 0;
    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        break;
      }
      charCount += walker.currentNode.textContent?.length || 0;
    }

    return charCount;
  }

  handleMouseUp = async () => {
    const selection = document.getSelection()?.getRangeAt(0)

    if (selection && selection.toString().trim() !== "") {
      let selectedText = selection.toString()

      let startIndex = selection.startOffset
      let endIndex = selection.endOffset

      const container = document.getElementById("actual-text")
      const charsBeforeStart = this.getCharactersCountUntilNode(selection.startContainer, container);
      const charsBeforeEnd = this.getCharactersCountUntilNode(selection.endContainer, container);

      startIndex += charsBeforeStart
      endIndex += charsBeforeEnd

      while (document.querySelector("#actual-text")?.textContent?.charAt(startIndex - 1) !== " " && document.querySelector("#actual-text")?.textContent?.charAt(startIndex - 1) !== undefined) {
        if (document.querySelector("#actual-text")?.textContent?.charAt(startIndex - 1) === '') {
          break
        }

        startIndex -= 1
      }

      while (document.querySelector("#actual-text")?.textContent?.charAt(endIndex) !== " " && document.querySelector("#actual-text")?.textContent?.charAt(endIndex) !== undefined) {
        if (document.querySelector("#actual-text")?.textContent?.charAt(endIndex) === '') {
          break
        }

        endIndex += 1
      }

      selectedText = document.querySelector("#actual-text")?.textContent?.slice(startIndex, endIndex) || ""

      // remove commas, periods, etc. from the end of the selection
      const re = /[.,/#!$%^&*;:{}=\-_`~()]$/g
      while (selectedText.match(re)) {
        selectedText = selectedText.slice(0, -1)
        endIndex -= 1
      }

      const { annotations, selectedReference } = this.state

      if (!annotations[selectedReference]) {
        annotations[selectedReference] = []
      }

      if (this.isAnnotated(startIndex, endIndex)) {
        const newAnnotations = this.removeAnnotation(startIndex, endIndex)
        await this.setState({ annotations: newAnnotations })
      } else {
        annotations[selectedReference].push({ start: startIndex, end: endIndex, label: selectedText })
        await this.setState({ annotations })
      }

      Streamlit.setComponentValue(annotations)
    }

    this.setState({ actual_text: this.renderText() })
  }

  async addReference(): Promise<void> {
    const { annotations } = this.state

    // if selected annotation is empty do not add a new one
    if (annotations[this.state.selectedReference] && annotations[this.state.selectedReference].length === 0) {
      return
    }

    const index = annotations.length + 1
    
    if (!annotations[index]) {
      annotations[index] = []
    }

    await this.setState({ 
      selectedReference: index,
      annotations
    })

    this.setState({ actual_text: this.renderText() })
  }

  async selectReference(index: number): Promise<void> {
    if (this.state.selectedReference === index || !this.state.annotations[index]) {
      return
    }

    await this.setState({ selectedReference: index })
    this.setState({ actual_text: this.renderText() })
  }

  async removeReference(index: number): Promise<void> {
    const { annotations } = this.state

    annotations.splice(index, 1)

    await this.setState({ annotations, selectedReference: 0 })
    this.setState({ actual_text: this.renderText() })
    Streamlit.setComponentValue(annotations)
  }

  renderText(): JSX.Element[] {
    const { text, annotations, selectedReference } = this.state
    const actual_text: JSX.Element[] = []

    if (!annotations[selectedReference]) {
      return [<span>{text}</span>]
    }


    let start = 0

    if (annotations[selectedReference].length > 0) {
      annotations[selectedReference].sort((a, b) => a.start - b.start)
    }

    annotations[selectedReference].forEach((annotation, index) => {
      actual_text.push(<span>{text.substring(start, annotation.start)}</span>)
      actual_text.push(<span className="annotated bg-blue-500 text-gray-100">{text.substring(annotation.start, annotation.end)}</span>)
      start = annotation.end
    })
    actual_text.push(<span>{text.substring(start, text.length)}</span>)


    return actual_text
  }

  render(): React.ReactNode {
    return (
      <div>
        <div className="flex flex-row flex-wrap">
          <div
            className="flex flex-wrap px-4 py-2 m-1 justify-between items-center text-sm font-medium cursor-pointer hover:bg-blue-600 hover:text-gray-100 bg-blue-500 text-gray-100"
            onClick={ () => this.addReference() }
            >
            <span>Add</span>
          </div>
          {this.state.annotations.map((reference, index) => (
            <span
              key={index}
              className={"flex flex-wrap pl-4 pr-2 py-2 m-1 justify-between items-center text-sm font-medium cursor-pointer hover:bg-blue-600 hover:text-gray-100" + (this.state.selectedReference === index ? " bg-blue-500 text-gray-100" : " bg-blue-900 text-gray-200")}
              onClick={() => { this.selectReference(index) }}
            >
              {reference[0]?.label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-3 hover:text-gray-300" viewBox="0 0 20 20"
                fill="currentColor"
                onClick={() => { this.removeReference(index) }}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                />
              </svg>
            </span>
          ))}
        </div>
        <div id="actual-text" className="mt-5 h-full" onMouseUp={this.handleMouseUp}>
          {this.state.actual_text}
        </div>
      </div>
    )
  }
}


export default withStreamlitConnection(Annotation)

