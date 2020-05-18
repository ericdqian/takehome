import React from 'react';
import Task from './Task'

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
    if(remaining.length === 0) {
      this.setState({current_task_ind: -1})
    }
    this.setState({tasks: remaining});
  }


  render() {
    const {tasks, current_task_ind} = this.state;
    if (this.state.current_task_ind !== -1) {
      return (

        <div className="ClassifyPage">
          <Task  task = {tasks[current_task_ind]} onSubmit = {this.onSubmit}/>

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
