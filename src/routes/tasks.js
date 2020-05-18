const express = require('express');
const router = express.Router();
const mongodb = require('../integrations/mongodb');
const uuid = require('uuid');

const sample_task = {
  task_id: 'randomid1',
  objects_to_annotate: ['baby cow', 'big cow'],
  img_url: 'https://i.imgur.com/v4cBreD.png',
  instructions: 'THIS IS A SAMPLE TASK: Draw a box around each baby cow and big cow'
}

const sample_task1 = {
  task_id: 'randomid2',
  objects_to_annotate: ['Motorcycle', 'Pedestrian'],
  img_url: 'https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/india-street-scene-dominique-amendola.jpg',
  instructions: 'THIS IS A SAMPLE TASK: Find all the motorcycles and pedestrians'
}

const sample_task2 = {
  task_id: 'randomid3',
  objects_to_annotate: ['Google logo'],
  img_url: 'https://techcrunch.com/wp-content/uploads/2015/10/screen-shot-2015-10-08-at-4-20-16-pm.png?w=730&crop=1',
  instructions: 'THIS IS A SAMPLE TASK: Draw a box around the Google logo'
}

sample_tasks = [sample_task, sample_task1, sample_task2]


router.get('/get-tasks', async (req, res, next) => {
  //logic for pulling tasks
  try {
    mongodb.connect("mongodb+srv://takehome:takehome@cluster0-b1brn.mongodb.net/test?retryWrites=true&w=majority", function(err, client) {
      if(!err) {
        var db = client.db('Tasks');
        db.collection('Sandbox').find({'status': 'Incomplete'}).toArray(function(err, data) {
          if (err) throw err;
          //can later add logic for which user is labeling which data, so we don't send someone else a task someone is working on but hasn't submitted
          res.status(200).send({
            tasks: data
          })

        });
      }
    });
  } catch (e) {
    //failed to connect to mongo: send some sample tasks
    res.status(200).send({
      tasks: sample_tasks
    })
  }

});

router.post('/submit-annotations', async (req, res, next) => {
  console.log('received annotations!');
  const task_id = req.body.task_id;
  const annotations = req.body.annotations;
  const comments = req.body.comments;
  try {
    mongodb.connect("mongodb+srv://takehome:takehome@cluster0-b1brn.mongodb.net/test?retryWrites=true&w=majority", function(err, client) {
      if(!err) {
        var db = client.db('Tasks');
        db.collection('Sandbox').find({'task_id': task_id}).toArray(function(err, data) {
          if (err) throw err;
          //add chcek for valid id later
          const query = data[0];
          const newvalues = { $set: {status: 'Complete', annotations: annotations, comments: comments } }
          db.collection('Sandbox').updateOne(query, newvalues, function(err, data) {
            if (err) throw err;
          })

        });
      }
    });
  } catch (e) {
    res.status(500).send({})
  }
  res.status(200).send({})
});

router.post('/submit-report', async (req, res, next) => {
  const task_id = req.body.task_id;
  const comments = req.body.comments;
  try {
    mongodb.connect("mongodb+srv://takehome:takehome@cluster0-b1brn.mongodb.net/test?retryWrites=true&w=majority", function(err, client) {
      if(!err) {
        var db = client.db('Tasks');
        db.collection('Sandbox').find({'task_id': task_id}).toArray(function(err, data) {
          if (err) throw err;
          //add chcek for valid id later
          const query = data[0];
          const newvalues = { $set: {status: 'Reported', comments: comments } }
          db.collection('Sandbox').updateOne(query, newvalues, function(err, data) {
            if (err) throw err;
          })

        });
      }
    });
  } catch (e) {
    res.status(500).send({})
  }
  res.status(200).send({})
});

router.post('/submit-task', async (req, res, next) => {
  const objects_to_annotate = req.body.objects_to_annotate;
  const img_url = req.body.img_url;
  const instructions = req.body.instructions;
  const task_id = uuid.v4();
  mongodb.connect("mongodb+srv://takehome:takehome@cluster0-b1brn.mongodb.net/test?retryWrites=true&w=majority", function(err, client) {
    if(!err) {
      var db = client.db('Tasks');
      const new_task = {
        task_id: task_id,
        objects_to_annotate: objects_to_annotate,
        img_url: img_url,
        instructions: instructions,
        status: 'Incomplete'
      }
      db.collection('Sandbox').insertOne(new_task, function(err, data) {
        if (err) {
          res.status(500).send({})
          throw err;
        }
        res.status(200).send({})
      });

    }
  });
})

module.exports = router;
