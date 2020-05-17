import React from 'react';
import Task from './Task'

class AnnotatePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      current_task_id: -1
    };
  }

  componentDidMount() {
    fetch('http://localhost:8000/api/tasks/get-tasks', {
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (data.tasks.length > 0) {
        this.setState({tasks: data.tasks, current_task_id: 0});
      }
    });
  }

  render() {
    const {tasks, current_task_id} = this.state;
    console.log(tasks[current_task_id])
    if (this.state.current_task_id !== -1) {
      return (

        <div className="ClassifyPage">
          <div> random </div>
          <Task  task = {tasks[current_task_id]} />
        </div>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }

  }
}

export default AnnotatePage;
