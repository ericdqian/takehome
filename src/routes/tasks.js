const express = require('express');
const router = express.Router();

router.get('/get-tasks', async (req, res, next) => {

  //logic for pulling tasks

  const sample_task = {
    task_id: '1avd',
    objects_to_annotate: ['baby cow', 'big cow'],
    img_url: 'https://i.imgur.com/v4cBreD.png',
    instruction: 'Draw a box around each baby cow and big cow'
  }

  res.status(200).send({
    tasks: [sample_task]
  })
})

module.exports = router;
