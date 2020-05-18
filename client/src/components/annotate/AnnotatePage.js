import React from 'react';
import Task from './Task';
import './AnnotatePage.css';

class AnnotatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      current_task_ind: -1,
      comments: ''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    fetch('http://localhost:8000/api/tasks/get-tasks', {
    })
    .then(response => response.json())
    .then(data => {
      if (data.tasks.length > 0) {
        this.setState({tasks: data.tasks, current_task_ind: 0});
      }
    });
  }



  onSubmit() {
    var remaining = [...this.state.tasks]
    remaining.splice(this.state.current_task_ind, 1);
    console.log('lengths', remaining.length, this.state.current_task_ind)
    if(remaining.length === 0) {
      this.setState({current_task_ind: -1})
    } else if(remaining.length == this.state.current_task_ind) {
      //finished last item
      this.setState({current_task_ind: remaining.length - 1})
    }
    this.setState({tasks: remaining});
  }


  render() {
    const {tasks, current_task_ind} = this.state;
    if (current_task_ind !== -1) {
      const buttons = []
      if (current_task_ind !== 0) {
        buttons.push(
          <button id = 'PrevButton' className = 'Button' onClick = {() => {this.setState({ current_task_ind: current_task_ind - 1 });}}>
            Previous
          </button>
        )
      }
      if (current_task_ind < tasks.length - 1) {
        buttons.push(
          <button id = 'NextButton' className = 'Button' onClick = {() => {this.setState({ current_task_ind: current_task_ind + 1});}}>
            Next
          </button>
        )
      }


      return (

        <div className="ClassifyPage">
          <Task  task = {tasks[current_task_ind]} onSubmit = {this.onSubmit}/>
          <div id = 'ToggleButtonsContainer' className = 'Container'>
            {buttons}
          </div>
        </div>
      )
    } else {
      return (
        <div>
          No tasks!
        </div>
      )
    }

  }
}

export default AnnotatePage;
