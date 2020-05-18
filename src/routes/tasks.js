const express = require('express');
const router = express.Router();

const sample_task = {
  task_id: 'randomid1',
  objects_to_annotate: ['baby cow', 'big cow'],
  img_url: 'https://i.imgur.com/v4cBreD.png',
  instructions: 'Draw a box around each baby cow and big cow'
}

const sample_task1 = {
  task_id: 'randomid2',
  objects_to_annotate: ['Google logo'],
  img_url: 'https://techcrunch.com/wp-content/uploads/2015/10/screen-shot-2015-10-08-at-4-20-16-pm.png?w=730&crop=1',
  instructions: 'Draw a box around the Google logo'
}

tasks = [sample_task, sample_task1]



router.post('submit-task', async (req, res, next) => {
  const task_id = req.body.task_id;
  const objects_to_annotate = req.body.objects_to_annotate;
  const img_url = req.body.img_url;
  const instructions = req.body.instructions;
})

router.get('/get-tasks', async (req, res, next) => {

  //logic for pulling tasks

  res.status(200).send({
    tasks: tasks
  })
});

router.post('/submit-annotations', async (req, res, next) => {
  console.log('received annotations!');
  const task_id = req.body.task_id;
  const annotations = req.body.annotations;
  const comments = req.body.comments;
});

router.post('/submit-report', async (req, res, next) => {
  console.log('received annotations!');
  const task_id = req.body.task_id;
  const comments = req.body.comments;
});

module.exports = router;
