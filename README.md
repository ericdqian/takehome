To run the server:
`cd src/`
`node app.js`

To run the client:
`cd client/`
`yarn start`

Add new tasks by posting to: https://shielded-oasis-73993.herokuapp.com/api/tasks/submit-task
Body should be JSON of the format:
{
  "objects_to_annotate": ["small cow", "big cow"],
  "img_url": "https://i.imgur.com/v4cBreD.png",
  "instructions": "THIS IS A SAMPLE TASK: Draw a box around each baby cow and big cow"
}

Where
`objects_to_annotate` is an array of strings of possible labels
`img_url` is a string representing the url to the desired image
`instructions` is a string with instructions for labeler
