const express = require('express');
const router = express.Router();

router.get('/get-tasks', async (req, res, next) => {

  //logic for pulling tasks

  const sample_task = {
    task_id: '1avd',
    objects_to_annotate: ['baby cow', 'big cow'],
    img_url: 'https://i.imgur.com/v4cBreD.png',
    instructions: 'Draw a box around each baby cow and big cow'
  }

  const sample_task1 = {
    task_id: '1avdaaaa',
    objects_to_annotate: ['stuff'],
    img_url: 'https://techcrunch.com/wp-content/uploads/2015/10/screen-shot-2015-10-08-at-4-20-16-pm.png?w=730&crop=1',
    instructions: 'Draw a box around the stuff'
  }

  res.status(200).send({
    tasks: [sample_task, sample_task1]
  })
})

router.post('/submit-annotations', async (req, res, next) => {
  console.log('received annotations!')
})

router.post('/submit-report', async (req, res, next) => {
  console.log('received annotations!')
})

module.exports = router;
