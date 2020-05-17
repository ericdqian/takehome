import React from 'react';
import './Task.css';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      annotations: [],
      current_annotation: 'cow',
      is_drawing: false,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      canvas_width: 0,
      canvas_height: 0
    };
  }

  componentDidMount() {
    const height = document.getElementById('TaskImage').clientHeight;
    const width = document.getElementById('TaskImage').clientWidth;
    console.log(width, height)
    this.setState({ canvas_width: width, canvas_height: height });
  }


  onMouseDown = (event) => {

    this.setState(prevState => ({
      is_drawing: !this.state.is_drawing
    }))
    if (!this.state.is_drawing) {
      this.setState({
        x1: event.pageX - event.target.offsetLeft,
        y1: event.pageY - event.target.offsetTop,
        x2: event.pageX - event.target.offsetLeft,
        y2: event.pageY - event.target.offsetTop,
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
      const x = event.pageX - event.target.offsetLeft
      const y = event.pageY - event.target.offsetTop
      if (x <= canvas_width && y <= canvas_height) {
        this.setState({
          x2: x,
          y2: y
        })
      }

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



  render() {
    const annotations = []
    for(var i = 0; i < this.state.annotations.length; i++) {
      const box = this.state.annotations[i]

      annotations.push(<div className = 'Annotation' style = {{height: box.h, width: box.w, left: box.left, top: box.top}}>{box.annotation} </div>)
    }

    const {x1, y1, x2, y2, is_drawing, current_annotation, canvas_width, canvas_height} = this.state;

    if (is_drawing) {

      const [w, h, left, top] = this.getBounds(x1, x2, y1, y2)
      return (

        <div className="Task">
          <div className = 'TaskImageContainer'>
            <img id = 'TaskImage' src={this.props.task.img_url}/>
            <div className = 'Annotation' style = {{height: h, width:w, left: left, top: top}}>{current_annotation}</div>
            <div className = 'Canvas' style = {{height: canvas_height, width: canvas_width}}
               onMouseDown={ this.onMouseDown }
               onMouseUp={ this.onMouseUp }
               onMouseMove={ this.onMouseMove}></div>
            {annotations}
          </div>
        </div>
      )
    } else {
      return (

        <div className="Task">
          <div className = 'TaskImageContainer'>
            <img id = 'TaskImage' src={this.props.task.img_url}/>
            <div className = 'Canvas' style = {{height: canvas_height, width: canvas_width}}
               onMouseDown={ this.onMouseDown }
               onMouseUp={ this.onMouseUp }
               onMouseMove={ this.onMouseMove}>  </div>

            {annotations}
          </div>
        </div>
      )
    }

  }
}

export default Task;
