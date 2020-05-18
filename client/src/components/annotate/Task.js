import React from 'react';
import './Task.css';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annotations: [],
      current_annotation: this.props.task.objects_to_annotate[0],
      is_drawing: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      canvas_width: 0,
      canvas_height: 0,
      comments: ''
    };

    this.handleObjectChange = this.handleObjectChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
  }

  componentDidMount() {
    const height = document.getElementById('TaskImage').clientHeight;
    const width = document.getElementById('TaskImage').clientWidth;
    this.setState({ canvas_width: width, canvas_height: height});
  }

  handleImageLoaded() {
    const height = document.getElementById('TaskImage').clientHeight;
    const width = document.getElementById('TaskImage').clientWidth;
    if (this.state.canvas_width !== width && this.state.canvas_height !== height) {
      this.setState({ canvas_width: width, canvas_height: height, annotations: []});
    }

  }

  componentWillReceiveProps(nextProps) {
    this.setState({ current_annotation: nextProps.task.objects_to_annotate[0] });
  }



  onMouseDown = (event) => {
    this.setState(prevState => ({
      is_drawing: !this.state.is_drawing
    }))
    if (!this.state.is_drawing) {
      const x = event.pageX - event.target.offsetLeft
      const y = event.pageY - event.target.offsetTop
      this.setState({
        x1: x,
        y1: y,
        x2: x,
        y2: y
      })

    } else {
      const {x1, y1, x2, y2, current_annotation} = this.state;
      const [w, h, left, top] = this.getBounds(x1, x2, y1, y2)
      const new_box = {
        w: w,
        h: h,
        left: left,
        top: top,
        annotation: current_annotation
      }
      this.setState({
        annotations: [...this.state.annotations, new_box]
      })
    }
  };

  onMouseMove = (event: MouseEvent) => {
    const {is_drawing, canvas_width, canvas_height} = this.state;
    if (is_drawing) {
      const x = event.pageX - event.target.offsetLeft;
      const y = event.pageY - event.target.offsetTop;
      this.setState({
        x2: x,
        y2: y
      })
    }
  };

  getBounds = (x1, x2, y1, y2) => {
    var w = 0;
    var h = 0;
    var left = 0;
    var top = 0;
    if (y2 - y1 >= 0) {
      h = y2 - y1;
      top = y1;
    } else {
      h = y1 - y2;
      top = y2;
    }
    if (x2 - x1 >= 0) {
      w = x2 - x1;
      left = x1;
    } else {
      w = x1 - x2;
      left = x2;
    }
    return [w, h, left, top]
  }

  handleObjectChange(event) {
    this.setState({current_annotation: event.target.value});
  }

  handleCommentChange(event) {
    this.setState({comments: event.target.value});
  }

  onReport() {
    const {task} = this.props
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id:  task.task_id,
          comments: this.state.comments,
        })
    };
    fetch('http://localhost:8000/api/tasks/submit-report', requestOptions)
      .then(response => response.json());
    this.setState({ annotations: [], comments: '' })
    this.props.onSubmit();
  }

  onSubmit() {
    const {task} = this.props
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id:  task.task_id,
          annotations: this.state.annotations,
          comments: this.state.comments,
        })
    };
    console.log(requestOptions.body);
    fetch('http://localhost:8000/api/tasks/submit-annotations', requestOptions)
      .then(response => response.json());
    this.setState({ annotations: [], comments: [] })
    this.props.onSubmit();
  }


  render() {
    const annotations = []
    for(var i = 0; i < this.state.annotations.length; i++) {
      const box = this.state.annotations[i]
      annotations.push(<div className = 'Annotation' style = {{height: box.h, width: box.w, left: box.left, top: box.top}}>{box.annotation} </div>)
    }
    const objects_to_annotate = this.props.task.objects_to_annotate.map(object_to_annotate =>
      <option value={object_to_annotate}>{object_to_annotate}</option>
    )

    const {x1, y1, x2, y2, is_drawing, current_annotation, canvas_width, canvas_height} = this.state;
    const [w, h, left, top] = this.getBounds(x1, x2, y1, y2)

    var current_box;
    if (is_drawing) {
      current_box = [<div className = 'Annotation' style = {{height: h, width:w, left: left, top: top}}>{current_annotation}</div>]
    } else {
      current_box = []
    }

    return (

        <div className="Task">
          <div id = 'TaskInstructionsContainer' className = 'Container'>
            <div  id = 'InstructionsHeader' className = 'Header'>
              Instructions
            </div>
            <div id = 'InstructionsText'>
              <p>
                <b>General instructions: </b>
                Choose the desired label from the dropdown, then draw boxes around the corresponding locations in the image.
                Press reset to erase all boxes. You may leave any relevant comments in the comments box. Click submit when finished with this task.
                Use next and previous to toggle between tasks.
                If there is an issue with the image or instructions, fill out any relevant comments, and click report.
              </p>
              <p>
                <b>Client instructions:</b> {this.props.task.instructions}
              </p>

            </div>
          </div>
          <div className = 'TaskImageContainer'>
            <img id = 'TaskImage' className = 'Offset' src={this.props.task.img_url} onLoad={this.handleImageLoaded.bind(this)}/>
            <div className = 'Detector Offset' style = {{height: canvas_height, width: canvas_width}}
              onMouseDown={ this.onMouseDown }
              onMouseMove={ this.onMouseMove }>
            </div>
            <div className = 'Canvas Offset' style = {{height: canvas_height, width: canvas_width}}>
              {current_box}
              {annotations}
            </div>
          </div>

          <div id = 'AnnotationChoicesContainer' className = 'Container'>
            <div id = 'AnnotationHeader' className = 'Header'>
              Labels
            </div>
            <select id = 'LabelsForm' value={this.state.current_annotation} onChange={this.handleObjectChange}>
              {objects_to_annotate}
            </select>
          </div>

          <div id = 'CommentsContainer' className = 'Container'>
            <form >
              <textarea type="text" id = 'CommentsBox' placeholder = {'Comments'} value={this.state.comments} onChange={this.handleCommentChange} />
            </form>
          </div>

          <div id = 'ButtonsContainer' className = 'Container'>
            <button id = 'ReportButton' className = 'Button' onClick = {() => {this.onReport();}}>
              Report
            </button>
            <button id = 'ResetButton' className = 'Button' onClick = {() => {this.setState({annotations: []})}}>
              Reset
            </button>
            <button id = 'SubmitButton' className = 'Button' onClick = {() => {this.onSubmit();}}>
              Submit
            </button>
          </div>



        </div>
      )

  }
}

export default Task;
